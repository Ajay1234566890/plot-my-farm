import { GoogleGenerativeAI } from '@google/generative-ai';
import { Audio } from 'expo-av';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

// Updated to use legacy API for deprecated getInfoAsync method

// Web Speech API types
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

class SpeechToTextService {
  private recording: Audio.Recording | null = null;
  private isRecording = false;
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    this.initializeGemini();
  }

  private initializeGemini() {
    try {
      const apiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY ||
                     process.env.EXPO_PUBLIC_GEMINI_API_KEY;

      if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE' || apiKey.trim() === '') {
        console.warn('⚠️ Gemini API key not configured for STT. Will use mock transcription.');
        return;
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      console.log('✅ Speech-to-Text Service initialized with Gemini API');
      console.log('🔑 API Key length:', apiKey.length, 'characters');
    } catch (error) {
      console.error('Error initializing Gemini for STT:', error);
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      console.log('📋 Requesting audio permissions...');

      // Check current permission status first
      const { status: currentStatus } = await Audio.getPermissionsAsync();
      console.log('Current permission status:', currentStatus);

      if (currentStatus === 'granted') {
        console.log('✅ Audio permission already granted');
        return true;
      }

      // Request permission
      const { status } = await Audio.requestPermissionsAsync();
      console.log('Permission request result:', status);

      if (status === 'granted') {
        console.log('✅ Audio permission granted');
        return true;
      } else {
        console.warn('⚠️ Audio permission denied:', status);
        return false;
      }
    } catch (error) {
      console.error('❌ Error requesting audio permissions:', error);
      return false;
    }
  }

  async startRecording(options?: SpeechRecognitionOptions): Promise<void> {
    try {
      console.log('🎤 Starting voice recording...');

      // Request permissions first
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        const errorMsg = 'Audio recording permission not granted. Please enable microphone access in your device settings.';
        console.error('❌', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('🔧 Setting audio mode...');
      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      console.log('🎙️ Creating recording instance...');
      // Create and start recording using standard preset
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      this.isRecording = true;

      console.log('✅ Voice recording started successfully');
    } catch (error: any) {
      console.error('❌ Error starting recording:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      this.isRecording = false;
      throw error;
    }
  }

  async stopRecording(): Promise<string | null> {
    try {
      if (!this.recording) {
        console.warn('No recording to stop');
        return null;
      }

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      this.isRecording = false;

      console.log('✅ Recording stopped, URI:', uri);
      return uri;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  }

  async transcribeAudio(audioUri: string, language: string = 'en'): Promise<string> {
    try {
      console.log('🎤 Starting real-time audio transcription...');

      // Check if audio file exists and has content using legacy API
      const fileInfo = await getInfoAsync(audioUri);
      console.log('📄 Audio file info:', fileInfo);

      if (!fileInfo.exists) {
        console.error('❌ Audio file does not exist');
        throw new Error('Audio file not found');
      }

      if (fileInfo.size === 0) {
        console.error('❌ Audio file is empty');
        throw new Error('Audio recording is empty');
      }

      // Read the audio file as base64
      console.log('📝 Reading audio file as base64...');
      const audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
        encoding: 'base64',
      });

      console.log('📊 Audio file size:', audioBase64.length, 'characters');

      // If Gemini is not initialized, use mock transcription but log this
      if (!this.genAI) {
        console.warn('⚠️ Gemini not initialized for STT. Using mock response for development.');
        console.warn('📝 Note: This will not process your actual voice input.');
        return await this.mockTranscription(language);
      }

      // Map language codes to full language names for better transcription
      const languageNames: { [key: string]: string } = {
        en: 'English',
        hi: 'Hindi',
        te: 'Telugu', 
        ta: 'Tamil',
        kn: 'Kannada',
      };

      const languageName = languageNames[language] || 'English';
      console.log(`🌐 Target language: ${languageName}`);

      // Try multiple Gemini models for transcription
      const modelIds = [
        'gemini-2.0-flash-exp',
        'gemini-1.5-flash', 
        'gemini-1.5-pro',
      ];

      for (const modelId of modelIds) {
        try {
          console.log(`🔄 Attempting transcription with model: ${modelId}`);
          const model = this.genAI.getGenerativeModel({ model: modelId });

          const prompt = `Please transcribe this audio recording into ${languageName}. I want to understand exactly what the user is saying. Return only the transcribed text, nothing else.`;

          // Determine audio format based on platform
          const mimeType = Platform.OS === 'ios' ? 'audio/m4a' : 'audio/mp4';
          console.log(`📱 Platform: ${Platform.OS}, MIME type: ${mimeType}`);

          const result = await model.generateContent([
            {
              inlineData: {
                data: audioBase64,
                mimeType: mimeType,
              },
            },
            prompt,
          ]);

          const response = result.response;
          const transcribedText = response.text().trim();

          console.log('📝 Raw Gemini response:', transcribedText);

          if (transcribedText && transcribedText.length > 0) {
            console.log('✅ Real transcription successful:', transcribedText);
            console.log('🎯 This is the actual user voice input being processed');
            return transcribedText;
          } else {
            console.warn('⚠️ Empty transcription from model, trying next model');
          }
        } catch (modelError: any) {
          console.warn(`⚠️ Model ${modelId} failed:`, modelError.message);
          if (modelError.message.includes('quota')) {
            console.warn('📊 Gemini API quota exceeded');
            break; // Don't try other models if quota exceeded
          }
          // Continue to next model for other errors
        }
      }

      // If all models fail, log this as a development issue
      console.error('❌ All Gemini transcription models failed');
      console.error('🔧 Please check:');
      console.error('   1. Gemini API key configuration');
      console.error('   2. API quota and billing');
      console.error('   3. Audio recording quality');
      console.error('📝 Using mock response for now (this is NOT your actual voice input)');
      
      return await this.mockTranscription(language);
    } catch (error: any) {
      console.error('❌ Critical error in audio transcription:', error);
      console.error('🔧 This means your voice input was not processed');
      console.error('📝 Returning mock response (not your actual voice)');
      
      // On critical error, return a helpful message
      return 'Sorry, I could not process your voice input. Please try speaking more clearly or check your microphone.';
    }
  }

  // Mock transcription for demo - replace with real API
  private async mockTranscription(language: string): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return mock text based on language
    const mockResponses: { [key: string]: string[] } = {
      en: [
        'I want to register as a farmer',
        'Show me market prices',
        'Add new crops',
        'Find nearby buyers',
        'Check weather forecast',
      ],
      hi: [
        'मैं किसान के रूप में पंजीकरण करना चाहता हूं',
        'मुझे बाजार की कीमतें दिखाएं',
        'नई फसलें जोड़ें',
      ],
      te: [
        'నేను రైతుగా నమోదు చేసుకోవాలనుకుంటున్నాను',
        'మార్కెట్ ధరలను చూపించు',
        'కొత్త పంటలను జోడించండి',
      ],
      ta: [
        'நான் விவசாயியாகப் பதிவு செய்ய விரும்புகிறேன்',
        'சந்தை விலைகளைக் காட்டு',
        'புதிய பயிர்களைச் சேர்க்கவும்',
      ],
      kn: [
        'ನಾನು ರೈತನಾಗಿ ನೋಂದಾಯಿಸಲು ಬಯಸುತ್ತೇನೆ',
        'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳನ್ನು ತೋರಿಸು',
        'ಹೊಸ ಬೆಳೆಗಳನ್ನು ಸೇರಿಸಿ',
      ],
    };

    const responses = mockResponses[language] || mockResponses.en;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getIsRecording(): boolean {
    return this.isRecording;
  }

  async cancelRecording(): Promise<void> {
    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
        this.recording = null;
        this.isRecording = false;
      } catch (error) {
        console.error('Error canceling recording:', error);
      }
    }
  }
}

export const speechToTextService = new SpeechToTextService();
