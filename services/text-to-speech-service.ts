import * as Speech from 'expo-speech';

export interface TextToSpeechOptions {
  language?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
}

class TextToSpeechService {
  private isSpeaking = false;

  async speak(text: string, options?: TextToSpeechOptions): Promise<void> {
    try {
      // Stop any ongoing speech
      if (this.isSpeaking) {
        await this.stop();
      }

      const language = this.getLanguageCode(options?.language || 'en');

      this.isSpeaking = true;

      // Get available voices and try to select a female voice
      const voices = await this.getAvailableVoices();
      const femaleVoice = voices.find(
        (voice) =>
          voice.language.startsWith(language.split('-')[0]) &&
          (voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('woman') ||
            voice.quality === Speech.VoiceQuality.Enhanced)
      );

      return new Promise((resolve, reject) => {
        Speech.speak(text, {
          language,
          pitch: options?.pitch || 1.2, // Slightly higher pitch for female voice
          rate: options?.rate || 0.95, // Slightly slower for clarity
          volume: options?.volume || 1.0,
          voice: femaleVoice?.identifier,
          onDone: () => {
            this.isSpeaking = false;
            resolve();
          },
          onError: (error) => {
            this.isSpeaking = false;
            reject(error);
          },
          onStopped: () => {
            this.isSpeaking = false;
            resolve();
          },
        });
      });
    } catch (error) {
      console.error('Error in text-to-speech:', error);
      this.isSpeaking = false;
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      await Speech.stop();
      this.isSpeaking = false;
    } catch (error) {
      console.error('Error stopping speech:', error);
      throw error;
    }
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  async pause(): Promise<void> {
    try {
      await Speech.pause();
    } catch (error) {
      console.error('Error pausing speech:', error);
      throw error;
    }
  }

  async resume(): Promise<void> {
    try {
      await Speech.resume();
    } catch (error) {
      console.error('Error resuming speech:', error);
      throw error;
    }
  }

  async getAvailableVoices(): Promise<Speech.Voice[]> {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices;
    } catch (error) {
      console.error('Error getting available voices:', error);
      return [];
    }
  }

  private getLanguageCode(language: string): string {
    const languageMap: { [key: string]: string } = {
      en: 'en-US',
      hi: 'hi-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
    };

    return languageMap[language] || 'en-US';
  }

  async isSpeechAvailable(): Promise<boolean> {
    try {
      const voices = await this.getAvailableVoices();
      return voices.length > 0;
    } catch (error) {
      return false;
    }
  }
}

export const textToSpeechService = new TextToSpeechService();
