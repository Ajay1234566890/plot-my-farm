import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ConversationContext {
  userId: string;
  userRole: 'farmer' | 'buyer';
  language: string;
  conversationHistory: Message[];
  currentTask?: string;
  taskData?: any;
  userName?: string; // For personalized greetings
  location?: string;
}

export interface VoiceAgentResponse {
  text: string;
  action?: {
    type: string;
    route?: string;
    params?: any;
  };
  requiresInput?: boolean;
  options?: string[];
}

class VoiceAgentService {
  private genAI: GoogleGenerativeAI | null = null;
  private conversationContext: ConversationContext | null = null;
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      const apiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY || 
                     process.env.EXPO_PUBLIC_GEMINI_API_KEY;

      if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        console.warn('⚠️ Gemini API key not configured. Voice agent will use mock responses.');
        this.initialized = false;
        return;
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.initialized = true;
      console.log('✅ Voice Agent Service initialized with Gemini API');
    } catch (error) {
      console.error('Error initializing Voice Agent Service:', error);
      this.initialized = false;
    }
  }

  initializeContext(context: Partial<ConversationContext>): void {
    this.conversationContext = {
      userId: context.userId || '',
      userRole: context.userRole || 'farmer',
      language: context.language || 'en',
      conversationHistory: context.conversationHistory || [],
      currentTask: context.currentTask,
      taskData: context.taskData,
    };
  }

  async processUserInput(userInput: string): Promise<VoiceAgentResponse> {
    try {
      if (!this.conversationContext) {
        throw new Error('Conversation context not initialized');
      }

      // Add user message to history
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userInput,
        timestamp: new Date(),
      };
      this.conversationContext.conversationHistory.push(userMessage);

      // Get response from Gemini or mock
      let response: VoiceAgentResponse;
      if (this.initialized && this.genAI) {
        response = await this.getGeminiResponse(userInput);
      } else {
        response = await this.getMockResponse(userInput);
      }

      // Add assistant message to history
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
      };
      this.conversationContext.conversationHistory.push(assistantMessage);

      return response;
    } catch (error) {
      console.error('Error processing user input:', error);
      throw error;
    }
  }

  private async getGeminiResponse(userInput: string): Promise<VoiceAgentResponse> {
    try {
      if (!this.genAI || !this.conversationContext) {
        return this.getMockResponse(userInput);
      }

      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

      // Build system prompt based on context
      const systemPrompt = this.buildSystemPrompt();
      
      // Build conversation history for context
      const conversationText = this.conversationContext.conversationHistory
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const prompt = `${systemPrompt}\n\nConversation History:\n${conversationText}\n\nUser: ${userInput}\n\nAssistant:`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Parse response and determine actions
      return this.parseResponse(responseText, userInput);
    } catch (error) {
      console.error('Error getting Gemini response:', error);
      return this.getMockResponse(userInput);
    }
  }

  private buildSystemPrompt(): string {
    const context = this.conversationContext!;
    const role = context.userRole;
    const language = context.language;

    return `You are an intelligent voice assistant for a farming marketplace app. Your role is to help ${role}s navigate the app and complete tasks through natural conversation.

User Role: ${role}
Language: ${language}
Current Task: ${context.currentTask || 'None'}

Available Actions for ${role}s:
${role === 'farmer' ? `
- Register as a farmer (farmer-profile-setup)
- Add new crops (edit-crop)
- View market prices (market-real-prices)
- Find nearby buyers (nearby-buyers)
- Check weather forecast (farmer-weather)
- View my offers (farmer-offers)
- View my farms (my-farms)
- View notifications (notifications)
` : `
- Register as a buyer (buyer-profile-setup)
- Find crops to buy (nearby-crops)
- View market prices (buyer-market-prices)
- Find nearby farmers (nearby-farmers)
- View my orders (my-orders)
- View cart (cart)
- View offers (buyer-offers)
`}

Instructions:
1. Be friendly, conversational, and helpful
2. Keep responses concise and actionable
3. When user wants to perform an action, guide them step by step
4. For multi-step processes (like registration), ask for information one field at a time
5. Always confirm actions before executing them
6. Use the user's language (${language}) for responses
7. Provide relevant suggestions based on the user's role

Response Format:
- Provide a natural language response
- If an action should be taken, indicate it clearly
- If more information is needed, ask specific questions
- Offer helpful suggestions when appropriate`;
  }

  private parseResponse(responseText: string, userInput: string): VoiceAgentResponse {
    // Parse the response to extract actions
    const lowerInput = userInput.toLowerCase();
    const lowerResponse = responseText.toLowerCase();

    let action: VoiceAgentResponse['action'] = undefined;

    // Detect common intents and map to actions
    if (this.conversationContext?.userRole === 'farmer') {
      if (lowerInput.includes('register') || lowerInput.includes('sign up') || lowerInput.includes('पंजीकरण')) {
        action = { type: 'navigate', route: '/farmer-profile-setup' };
      } else if (lowerInput.includes('add crop') || lowerInput.includes('new crop') || lowerInput.includes('फसल')) {
        action = { type: 'navigate', route: '/edit-crop' };
      } else if (lowerInput.includes('market') || lowerInput.includes('price') || lowerInput.includes('कीमत')) {
        action = { type: 'navigate', route: '/market-real-prices' };
      } else if (lowerInput.includes('buyer') || lowerInput.includes('खरीदार')) {
        action = { type: 'navigate', route: '/nearby-buyers' };
      } else if (lowerInput.includes('weather') || lowerInput.includes('मौसम')) {
        action = { type: 'navigate', route: '/farmer-weather' };
      } else if (lowerInput.includes('offer') || lowerInput.includes('ऑफर')) {
        action = { type: 'navigate', route: '/farmer-offers' };
      }
    } else {
      if (lowerInput.includes('register') || lowerInput.includes('sign up')) {
        action = { type: 'navigate', route: '/buyer-profile-setup' };
      } else if (lowerInput.includes('crop') || lowerInput.includes('buy')) {
        action = { type: 'navigate', route: '/nearby-crops' };
      } else if (lowerInput.includes('market') || lowerInput.includes('price')) {
        action = { type: 'navigate', route: '/buyer-market-prices' };
      } else if (lowerInput.includes('farmer')) {
        action = { type: 'navigate', route: '/nearby-farmers' };
      } else if (lowerInput.includes('order')) {
        action = { type: 'navigate', route: '/my-orders' };
      } else if (lowerInput.includes('cart')) {
        action = { type: 'navigate', route: '/cart' };
      }
    }

    return {
      text: responseText,
      action,
      requiresInput: lowerResponse.includes('?'),
    };
  }

  private async getMockResponse(userInput: string): Promise<VoiceAgentResponse> {
    const lowerInput = userInput.toLowerCase();
    const context = this.conversationContext!;
    const language = context.language;

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock responses based on language and input
    const responses = this.getMockResponsesByLanguage(language);

    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('नमस्ते') || lowerInput.includes('హలో')) {
      return { text: responses.greeting };
    }

    if (lowerInput.includes('register') || lowerInput.includes('sign up') || lowerInput.includes('पंजीकरण') || lowerInput.includes('నమోదు')) {
      return {
        text: responses.register,
        action: { type: 'navigate', route: context.userRole === 'farmer' ? '/farmer-profile-setup' : '/buyer-profile-setup' },
      };
    }

    if (lowerInput.includes('crop') || lowerInput.includes('add') || lowerInput.includes('फसल') || lowerInput.includes('పంట')) {
      return {
        text: responses.addCrop,
        action: { type: 'navigate', route: '/edit-crop' },
      };
    }

    if (lowerInput.includes('market') || lowerInput.includes('price') || lowerInput.includes('कीमत') || lowerInput.includes('ధర')) {
      return {
        text: responses.marketPrices,
        action: { type: 'navigate', route: context.userRole === 'farmer' ? '/market-real-prices' : '/buyer-market-prices' },
      };
    }

    if (lowerInput.includes('buyer') || lowerInput.includes('खरीदार') || lowerInput.includes('కొనుగోలుదారు')) {
      return {
        text: responses.findBuyers,
        action: { type: 'navigate', route: '/nearby-buyers' },
      };
    }

    if (lowerInput.includes('weather') || lowerInput.includes('मौसम') || lowerInput.includes('వాతావరణం')) {
      return {
        text: responses.weather,
        action: { type: 'navigate', route: '/farmer-weather' },
      };
    }

    // Default response
    return {
      text: responses.default,
      requiresInput: true,
    };
  }

  private getMockResponsesByLanguage(language: string): any {
    const responseMap: { [key: string]: any } = {
      en: {
        greeting: "Hello! I'm your farming assistant. How can I help you today? You can ask me to register, add crops, check market prices, find buyers, or check weather.",
        register: "Great! I'll help you register. Let me take you to the registration page where you can fill in your details.",
        addCrop: "Perfect! I'll take you to the crop management page where you can add your crops with details like crop type, quantity, and price.",
        marketPrices: "I'll show you the latest market prices for various crops. This will help you make informed decisions about your produce.",
        findBuyers: "Let me help you find nearby buyers. I'll show you a map with buyers in your area.",
        weather: "I'll show you the weather forecast for your location. This will help you plan your farming activities.",
        default: "I can help you with registration, adding crops, checking market prices, finding buyers, or viewing weather. What would you like to do?",
      },
      hi: {
        greeting: "नमस्ते! मैं आपका कृषि सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं? आप मुझसे पंजीकरण, फसल जोड़ने, बाजार की कीमतें देखने, खरीदार खोजने या मौसम जांचने के लिए कह सकते हैं।",
        register: "बढ़िया! मैं आपका पंजीकरण करने में मदद करूंगा। मैं आपको पंजीकरण पृष्ठ पर ले जाता हूं जहां आप अपना विवरण भर सकते हैं।",
        addCrop: "बिल्कुल सही! मैं आपको फसल प्रबंधन पृष्ठ पर ले जाता हूं जहां आप फसल के प्रकार, मात्रा और कीमत जैसे विवरण के साथ अपनी फसलें जोड़ सकते हैं।",
        marketPrices: "मैं आपको विभिन्न फसलों की नवीनतम बाजार कीमतें दिखाऊंगा। इससे आपको अपनी उपज के बारे में सूचित निर्णय लेने में मदद मिलेगी।",
        findBuyers: "मैं आपको पास के खरीदार खोजने में मदद करता हूं। मैं आपको आपके क्षेत्र में खरीदारों के साथ एक मानचित्र दिखाऊंगा।",
        weather: "मैं आपको आपके स्थान के लिए मौसम का पूर्वानुमान दिखाऊंगा। इससे आपको अपनी खेती की गतिविधियों की योजना बनाने में मदद मिलेगी।",
        default: "मैं पंजीकरण, फसल जोड़ने, बाजार की कीमतें जांचने, खरीदार खोजने या मौसम देखने में आपकी मदद कर सकता हूं। आप क्या करना चाहेंगे?",
      },
      te: {
        greeting: "హలో! నేను మీ వ్యవసాయ సహాయకుడిని. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను? మీరు నమోదు చేసుకోవడం, పంటలు జోడించడం, మార్కెట్ ధరలను తనిఖీ చేయడం, కొనుగోలుదారులను కనుగొనడం లేదా వాతావరణాన్ని తనిఖీ చేయమని నన్ను అడగవచ్చు.",
        register: "గొప్పగా! నేను మిమ్మల్ని నమోదు చేయడంలో సహాయం చేస్తాను. మీ వివరాలను నమోదు చేసుకునే పేజీకి మిమ్మల్ని తీసుకెళ్తాను.",
        addCrop: "సరైనది! పంట రకం, పరిమాణం మరియు ధర వంటి వివరాలతో మీ పంటలను జోడించగల పంట నిర్వహణ పేజీకి మిమ్మల్ని తీసుకెళ్తాను.",
        marketPrices: "వివిధ పంటల తాజా మార్కెట్ ధరలను మీకు చూపిస్తాను. ఇది మీ ఉత్పత్తి గురించి సమాచారంతో నిర్ణయాలు తీసుకోవడానికి మీకు సహాయం చేస్తుంది.",
        findBuyers: "సమీపంలోని కొనుగోలుదారులను కనుగొనడంలో మీకు సహాయం చేస్తాను. మీ ప్రాంతంలోని కొనుగోలుదారులతో మ్యాప్‌ని మీకు చూపిస్తాను.",
        weather: "మీ స్థానం కోసం వాతావరణ సూచనను మీకు చూపిస్తాను. ఇది మీ వ్యవసాయ కార్యకలాపాలను ప్లాన్ చేసుకోవడానికి మీకు సహాయం చేస్తుంది.",
        default: "నమోదు, పంటలు జోడించడం, మార్కెట్ ధరలను తనిఖీ చేయడం, కొనుగోలుదారులను కనుగొనడం లేదా వాతావరణాన్ని చూడటంలో నేను మీకు సహాయం చేయగలను. మీరు ఏమి చేయాలనుకుంటున్నారు?",
      },
      ta: {
        greeting: "வணக்கம்! நான் உங்கள் விவசாய உதவியாளர். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்? பதிவு செய்ய, பயிர்களைச் சேர்க்க, சந்தை விலைகளைச் சரிபார்க்க, வாங்குபவர்களைக் கண்டறிய அல்லது வானிலையைச் சரிபார்க்க என்னிடம் கேட்கலாம்.",
        register: "அருமை! உங்களைப் பதிவு செய்ய நான் உதவுகிறேன். உங்கள் விவரங்களை நிரப்பக்கூடிய பதிவுப் பக்கத்திற்கு உங்களை அழைத்துச் செல்கிறேன்.",
        addCrop: "சரியானது! பயிர் வகை, அளவு மற்றும் விலை போன்ற விவரங்களுடன் உங்கள் பயிர்களைச் சேர்க்கக்கூடிய பயிர் நிர்வாகப் பக்கத்திற்கு உங்களை அழைத்துச் செல்கிறேன்.",
        marketPrices: "பல்வேறு பயிர்களுக்கான சமீபத்திய சந்தை விலைகளை உங்களுக்குக் காண்பிப்பேன். இது உங்கள் விளைபொருள் பற்றி தகவலறிந்த முடிவுகளை எடுக்க உதவும்.",
        findBuyers: "அருகிலுள்ள வாங்குபவர்களைக் கண்டறிய உதவுகிறேன். உங்கள் பகுதியில் உள்ள வாங்குபவர்களுடன் ஒரு வரைபடத்தை உங்களுக்குக் காண்பிப்பேன்.",
        weather: "உங்கள் இடத்திற்கான வானிலை முன்னறிவிப்பை உங்களுக்குக் காண்பிப்பேன். இது உங்கள் விவசாய நடவடிக்கைகளைத் திட்டமிட உதவும்.",
        default: "பதிவு, பயிர்களைச் சேர்ப்பது, சந்தை விலைகளைச் சரிபார்ப்பது, வாங்குபவர்களைக் கண்டறிவது அல்லது வானிலையைப் பார்ப்பதில் நான் உங்களுக்கு உதவ முடியும். நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",
      },
      kn: {
        greeting: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು? ನೀವು ನೋಂದಾಯಿಸಲು, ಬೆಳೆಗಳನ್ನು ಸೇರಿಸಲು, ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲು, ಖರೀದಿದಾರರನ್ನು ಹುಡುಕಲು ಅಥವಾ ಹವಾಮಾನವನ್ನು ಪರಿಶೀಲಿಸಲು ನನ್ನನ್ನು ಕೇಳಬಹುದು.",
        register: "ಅದ್ಭುತ! ನಾನು ನಿಮ್ಮನ್ನು ನೋಂದಾಯಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಬಹುದಾದ ನೋಂದಣಿ ಪುಟಕ್ಕೆ ನಿಮ್ಮನ್ನು ಕರೆದೊಯ್ಯುತ್ತೇನೆ.",
        addCrop: "ಸರಿಯಾಗಿದೆ! ಬೆಳೆ ಪ್ರಕಾರ, ಪ್ರಮಾಣ ಮತ್ತು ಬೆಲೆಯಂತಹ ವಿವರಗಳೊಂದಿಗೆ ನಿಮ್ಮ ಬೆಳೆಗಳನ್ನು ಸೇರಿಸಬಹುದಾದ ಬೆಳೆ ನಿರ್ವಹಣಾ ಪುಟಕ್ಕೆ ನಿಮ್ಮನ್ನು ಕರೆದೊಯ್ಯುತ್ತೇನೆ.",
        marketPrices: "ವಿವಿಧ ಬೆಳೆಗಳ ಇತ್ತೀಚಿನ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳನ್ನು ನಾನು ನಿಮಗೆ ತೋರಿಸುತ್ತೇನೆ. ಇದು ನಿಮ್ಮ ಉತ್ಪನ್ನದ ಬಗ್ಗೆ ತಿಳುವಳಿಕೆಯುಳ್ಳ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
        findBuyers: "ಹತ್ತಿರದ ಖರೀದಿದಾರರನ್ನು ಹುಡುಕಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಖರೀದಿದಾರರೊಂದಿಗೆ ನಕ್ಷೆಯನ್ನು ನಾನು ನಿಮಗೆ ತೋರಿಸುತ್ತೇನೆ.",
        weather: "ನಿಮ್ಮ ಸ್ಥಳಕ್ಕಾಗಿ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಯನ್ನು ನಾನು ನಿಮಗೆ ತೋರಿಸುತ್ತೇನೆ. ಇದು ನಿಮ್ಮ ಕೃಷಿ ಚಟುವಟಿಕೆಗಳನ್ನು ಯೋಜಿಸಲು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
        default: "ನೋಂದಣಿ, ಬೆಳೆಗಳನ್ನು ಸೇರಿಸುವುದು, ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸುವುದು, ಖರೀದಿದಾರರನ್ನು ಹುಡುಕುವುದು ಅಥವಾ ಹವಾಮಾನವನ್ನು ನೋಡುವುದರಲ್ಲಿ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಹುದು. ನೀವು ಏನು ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?",
      },
    };

    return responseMap[language] || responseMap.en;
  }

  getConversationHistory(): Message[] {
    return this.conversationContext?.conversationHistory || [];
  }

  clearConversationHistory(): void {
    if (this.conversationContext) {
      this.conversationContext.conversationHistory = [];
      this.conversationContext.currentTask = undefined;
      this.conversationContext.taskData = undefined;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const voiceAgentService = new VoiceAgentService();
