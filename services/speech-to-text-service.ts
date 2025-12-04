import { GoogleGenerativeAI } from '@google/generative-ai';
import { Audio } from 'expo-av';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Using legacy FileSystem API for compatibility with Expo SDK 54

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
        console.warn('⚠ Gemini API key not configured for STT. Will use mock transcription.');
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
        console.warn('⚠ Audio permission denied:', status);
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
      // Set audio mode with proper Android configuration
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      console.log('🎙 Creating recording instance...');
      // Create and start recording with explicit configuration for better Android compatibility
      const recordingOptions = Platform.OS === 'android'
        ? {
          android: {
            extension: '.m4a',
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: '.m4a',
            outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
          web: {
            mimeType: 'audio/webm',
            bitsPerSecond: 128000,
          },
        }
        : Audio.RecordingOptionsPresets.HIGH_QUALITY;

      const { recording } = await Audio.Recording.createAsync(recordingOptions);

      this.recording = recording;
      this.isRecording = true;

      // Get recording status to verify it's actually recording
      const status = await recording.getStatusAsync();
      console.log('📊 Recording status:', {
        canRecord: status.canRecord,
        isRecording: status.isRecording,
        isDoneRecording: status.isDoneRecording,
        durationMillis: status.durationMillis,
      });

      if (status.isRecording) {
        console.log('✅ Voice recording started successfully and is actively capturing audio');
      } else {
        console.warn('⚠ Recording created but not actively recording. Status:', status);
      }
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
        console.warn('⚠ No recording to stop');
        return null;
      }

      console.log('🛑 Stopping recording...');

      // Get final status before stopping
      const finalStatus = await this.recording.getStatusAsync();
      console.log('📊 Final recording status before stop:', {
        isRecording: finalStatus.isRecording,
        durationMillis: finalStatus.durationMillis,
        isDoneRecording: finalStatus.isDoneRecording,
      });

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();

      console.log('📁 Recording URI:', uri);

      // Log the recording URI (file existence will be verified when reading)
      if (uri) {
        console.log('✅ Recording file created at:', uri);
      }

      this.recording = null;
      this.isRecording = false;

      console.log('✅ Recording stopped, URI:', uri);
      return uri;
    } catch (error) {
      console.error('❌ Error stopping recording:', error);
      this.recording = null;
      this.isRecording = false;
      throw error;
    }
  }

  async transcribeAudio(audioUri: string, language: string = 'en'): Promise<string> {
    try {
      console.log('🎤 Starting real-time audio transcription...');
      console.log('📁 Audio file URI:', audioUri);

      // Read the audio file as base64 using fetch (new Expo SDK 54 approach)
      console.log('📝 Reading audio file as base64...');

      let audioBase64: string;
      try {
        // Use fetch to read the file as a blob
        const response = await fetch(audioUri);
        const blob = await response.blob();

        // Convert blob to base64
        const reader = new FileReader();
        audioBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            const base64data = reader.result as string;
            // Remove the data URL prefix (e.g., "data:audio/m4a;base64,")
            const base64 = base64data.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (readError) {
        console.error('❌ Error reading audio file:', readError);
        throw new Error('Failed to read audio file. Please try recording again.');
      }

      console.log('📊 Audio file size:', audioBase64.length, 'characters');

      // Check if the file has content
      if (!audioBase64 || audioBase64.length === 0) {
        console.error('❌ Audio file is empty');
        throw new Error('Audio recording is empty. Please speak louder and try again.');
      }

      // If Gemini is not initialized, use mock transcription but log this
      if (!this.genAI) {
        console.warn('⚠ Gemini not initialized for STT. Using mock response for development.');
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

      // Use Gemini 2.5 Pro for transcription with enhanced prompts
      const modelIds = [
        'gemini-2.0-flash-exp',
        'gemini-1.5-flash',
        'gemini-1.5-pro',
      ];

      let lastError: any = null;

      for (const modelId of modelIds) {
        try {
          console.log(`🔄 Attempting transcription with model: ${modelId}`);
          const model = this.genAI.getGenerativeModel({
            model: modelId,
            generationConfig: {
              temperature: 0.1, // Lower temperature for more accurate transcription
              topP: 0.8,
              topK: 40,
            }
          });

          // Enhanced prompt for better transcription accuracy
          const prompt = `You are an expert speech-to-text transcription system. 

TASK: Transcribe the audio recording into ${languageName} text with maximum accuracy.

INSTRUCTIONS:
1. Listen carefully to the entire audio
2. Transcribe EXACTLY what is spoken, word for word
3. Handle background noise and unclear speech intelligently
4. If the audio is unclear or empty, respond with: "Could not understand audio"
5. Return ONLY the transcribed text - no explanations, no formatting, no extra text
6. Preserve the natural language and grammar of the speaker
7. For search queries or commands, capture the intent clearly

IMPORTANT: 
- Do not add punctuation unless clearly spoken
- Do not correct grammar unless it changes meaning
- Focus on accuracy over formality
- If multiple interpretations exist, choose the most likely one

Transcribe the audio now:`;

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
          let transcribedText = response.text().trim();

          console.log('📝 Raw Gemini response:', transcribedText);

          // Clean up the response
          transcribedText = transcribedText
            .replace(/^["']|["']$/g, '') // Remove surrounding quotes
            .replace(/\n+/g, ' ') // Replace newlines with spaces
            .trim();

          // Check for "could not understand" response
          if (transcribedText.toLowerCase().includes('could not understand')) {
            console.warn('⚠ Audio was unclear, trying next model');
            lastError = new Error('Audio unclear');
            continue;
          }

          if (transcribedText && transcribedText.length > 0) {
            console.log('✅ Real transcription successful:', transcribedText);
            console.log('🎯 This is the actual user voice input being processed');
            return transcribedText;
          } else {
            console.warn('⚠ Empty transcription from model, trying next model');
            lastError = new Error('Empty transcription');
          }
        } catch (modelError: any) {
          console.warn(`⚠ Model ${modelId} failed:`, modelError.message);
          lastError = modelError;

          if (modelError.message.includes('quota')) {
            console.warn('📊 Gemini API quota exceeded');
            throw new Error('Voice recognition service temporarily unavailable. Please try again later.');
          }
          // Continue to next model for other errors
        }
      }

      // If all models fail, provide helpful error message
      console.error('❌ All Gemini transcription models failed');
      console.error('Last error:', lastError);

      throw new Error('Could not understand your voice. Please speak clearly and try again.');
    } catch (error: any) {
      console.error('❌ Critical error in audio transcription:', error);

      // Return user-friendly error message
      if (error.message.includes('quota') || error.message.includes('temporarily unavailable')) {
        throw error; // Re-throw quota errors
      }

      throw new Error('Voice recognition failed. Please check your microphone and try again.');
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