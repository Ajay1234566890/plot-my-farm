import { formDefinitions } from '@/config/form-definitions';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';
import { conversationStateService } from './conversation-state-service';
import { formAutomationService } from './form-automation-service';
import { ScreenContext, screenContextService } from './screen-context-service';

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
  screenContext?: ScreenContext; // Current screen context
  isFormConversation?: boolean; // Is this a form-filling conversation?
}

export interface VoiceAgentResponse {
  text: string;
  action?: {
    type: string;
    route?: string;
    params?: any;
    fieldName?: string; // For form field updates
    fieldValue?: any; // For form field updates
  };
  requiresInput?: boolean;
  options?: string[];
  progress?: number; // Form completion progress (0-100)
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
      screenContext: context.screenContext,
      isFormConversation: context.isFormConversation || false,
    };
  }

  /**
   * Start a form-filling conversation
   */
  startFormConversation(screenName: string): VoiceAgentResponse {
    console.log('🎬 [VOICE-AGENT] Starting form conversation for:', screenName);

    // Get form definition
    const formDef = formDefinitions[screenName];
    if (!formDef) {
      console.warn('⚠️ [VOICE-AGENT] No form definition found for:', screenName);
      return {
        text: "I'm sorry, I can't help with this form right now.",
        requiresInput: false,
      };
    }

    // Start conversation state
    conversationStateService.startConversation(formDef);

    // Get first field
    const firstField = conversationStateService.getNextField();
    if (!firstField) {
      return {
        text: "This form doesn't have any fields to fill.",
        requiresInput: false,
      };
    }

    // Mark as form conversation
    if (this.conversationContext) {
      this.conversationContext.isFormConversation = true;
    }

    return {
      text: `Great! Let me help you with that. ${firstField.voicePrompt}`,
      requiresInput: true,
      progress: 0,
    };
  }

  async processUserInput(userInput: string): Promise<VoiceAgentResponse> {
    try {
      if (!this.conversationContext) {
        throw new Error('Conversation context not initialized');
      }

      // Check if we're in a form conversation
      const screenContext = screenContextService.getContext();
      const conversationState = conversationStateService.getState();

      // Add user message to history
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userInput,
        timestamp: new Date(),
      };
      this.conversationContext.conversationHistory.push(userMessage);

      // If we're in a form conversation, handle it specially
      let response: VoiceAgentResponse;
      if (conversationState && screenContext?.hasForm) {
        response = await this.handleFormConversation(userInput, screenContext, conversationState);
      } else {
        // Regular conversation
        if (this.initialized && this.genAI) {
          response = await this.getGeminiResponse(userInput);
        } else {
          response = await this.getMockResponse(userInput);
        }
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

  /**
   * Handle form-filling conversation
   */
  private async handleFormConversation(
    userInput: string,
    screenContext: ScreenContext,
    conversationState: any
  ): Promise<VoiceAgentResponse> {
    console.log('📝 [VOICE-AGENT] Handling form conversation');

    // Get the next field to fill
    const nextField = conversationStateService.getNextField();

    if (!nextField) {
      // All fields filled
      return {
        text: `Great! I have all the information. Would you like me to save this now?`,
        requiresInput: true,
        progress: 100,
      };
    }

    // Parse the user's input for the current field
    const parsedValue = formAutomationService.parseVoiceInput(
      userInput,
      nextField.type,
      nextField.options
    );

    // Set the field value in the conversation state
    conversationStateService.setFieldValue(nextField.name, parsedValue, true);

    // Try to auto-fill the form field
    formAutomationService.setFieldValue(screenContext.screenName, nextField.name, parsedValue);

    // Get the next field
    const newNextField = conversationStateService.getNextField();
    const progress = conversationStateService.getProgress();

    if (!newNextField) {
      // All fields filled
      return {
        text: `Perfect! I've filled in all the details. Would you like me to save this?`,
        requiresInput: true,
        progress: 100,
        action: {
          type: 'formComplete',
        },
      };
    }

    // Ask for the next field
    return {
      text: `Got it! ${newNextField.voicePrompt}`,
      requiresInput: true,
      progress,
    };
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

    return `You are a friendly and patient voice assistant for "Plot My Farm", a farming marketplace app. You help farmers and buyers who may not be tech-savvy to use the app through natural conversation.

User Role: ${role}
Language: ${language}
Current Task: ${context.currentTask || 'None'}

Your Personality:
- Warm, friendly, and patient like a helpful neighbor
- Use simple, clear language that farmers can easily understand
- Be encouraging and supportive
- Explain things step-by-step without overwhelming the user
- Celebrate small wins ("Great!", "Perfect!", "Well done!")

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
- View voice AI help (voice-ai)
` : `
- Register as a buyer (buyer-profile-setup)
- Find crops to buy (nearby-crops)
- View market prices (buyer-market-prices)
- Find nearby farmers (nearby-farmers)
- View my orders (my-orders)
- View cart (cart)
- View offers (buyer-offers)
- View voice AI help (buyer-voice-ai)
`}

Conversation Guidelines:
1. **First-time users**: Greet warmly and offer to help them get started
2. **Be conversational**: Use natural language, not robotic responses
3. **One step at a time**: Don't overwhelm with too many options
4. **Confirm understanding**: Ask "Does that make sense?" or "Would you like me to help with that?"
5. **Provide context**: Explain WHY an action is useful before suggesting it
6. **Use examples**: "For example, you can add tomatoes, wheat, or rice"
7. **Be proactive**: Suggest next steps based on what the user just did
8. **Handle confusion gracefully**: If user seems lost, offer to start over or explain differently
9. **Multilingual support**: Respond in the user's language (${language})
10. **Accessibility**: Remember many users may not read well, so voice is their primary interface

Response Style:
- Keep responses SHORT (1-3 sentences max)
- Ask ONE question at a time
- Use simple words, avoid technical jargon
- Be encouraging and positive
- End with a clear next step or question

Example Good Responses:
- "Hello! Welcome to Plot My Farm. Are you a farmer looking to sell crops, or a buyer looking to purchase?"
- "Great! Let me help you add your first crop. What crop would you like to add?"
- "Perfect! I'll show you today's market prices. This helps you know the best price for your crops."

Example Bad Responses:
- "Please navigate to the crop management interface and input your agricultural produce data."
- "You have multiple options: registration, crop addition, market analysis, buyer discovery, weather monitoring..."`;
  }

  private parseResponse(responseText: string, userInput: string): VoiceAgentResponse {
    // Parse the response to extract actions
    const lowerInput = userInput.toLowerCase();
    const lowerResponse = responseText.toLowerCase();

    let action: VoiceAgentResponse['action'] = undefined;

    // Check for role selection (for select-role page)
    if (lowerInput.includes('farmer') && (lowerInput.includes('i am') || lowerInput.includes('i\'m') || lowerInput.includes('select') || lowerInput.includes('choose'))) {
      action = { type: 'selectRole', params: { role: 'farmer' } };
    } else if (lowerInput.includes('buyer') && (lowerInput.includes('i am') || lowerInput.includes('i\'m') || lowerInput.includes('select') || lowerInput.includes('choose'))) {
      action = { type: 'selectRole', params: { role: 'buyer' } };
    }

    // Check for language selection
    if (lowerInput.includes('english')) {
      action = { type: 'selectLanguage', params: { language: 'en' } };
    } else if (lowerInput.includes('telugu') || lowerInput.includes('తెలుగు')) {
      action = { type: 'selectLanguage', params: { language: 'te' } };
    } else if (lowerInput.includes('hindi') || lowerInput.includes('हिंदी')) {
      action = { type: 'selectLanguage', params: { language: 'hi' } };
    } else if (lowerInput.includes('tamil') || lowerInput.includes('தமிழ்')) {
      action = { type: 'selectLanguage', params: { language: 'ta' } };
    } else if (lowerInput.includes('kannada') || lowerInput.includes('ಕನ್ನಡ')) {
      action = { type: 'selectLanguage', params: { language: 'kn' } };
    }

    // Detect common intents and map to actions (only if no role/language action detected)
    if (!action && this.conversationContext?.userRole === 'farmer') {
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
      } else if (lowerInput.includes('voice') || lowerInput.includes('help')) {
        action = { type: 'navigate', route: '/voice-ai' };
      }
    } else if (!action && this.conversationContext?.userRole === 'buyer') {
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
      } else if (lowerInput.includes('voice') || lowerInput.includes('help')) {
        action = { type: 'navigate', route: '/buyer-voice-ai' };
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
        greeting: "Hello! Welcome to Plot My Farm. I'm here to help you. Are you a farmer looking to sell crops, or a buyer looking to purchase?",
        register: "Great! Let me help you get started. I'll take you to the registration page. It's quick and easy!",
        addCrop: "Perfect! Let's add your crop. I'll take you to the page where you can tell me what crop you have, how much, and your price.",
        marketPrices: "Good idea! I'll show you today's market prices. This helps you know the best price for your crops.",
        findBuyers: "Let me help you find buyers near you. I'll show you a map with buyers in your area who might be interested.",
        weather: "I'll show you the weather forecast. This helps you plan when to harvest or plant.",
        default: "I'm here to help! You can ask me to add crops, check prices, find buyers, or see the weather. What would you like to do?",
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
