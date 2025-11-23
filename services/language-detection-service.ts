/**
 * Language Detection Service
 * Automatically detects user's language based on GPS location
 */

import { Language } from '@/contexts/auth-context';
import { LocationService } from './location-service';

interface StateLanguageMapping {
  state: string;
  language: Language;
  alternateNames?: string[];
}

// Mapping of Indian states to primary languages
const STATE_LANGUAGE_MAP: StateLanguageMapping[] = [
  // Telugu-speaking states
  { state: 'Telangana', language: 'te', alternateNames: ['TS'] },
  { state: 'Andhra Pradesh', language: 'te', alternateNames: ['AP'] },
  
  // Tamil-speaking states
  { state: 'Tamil Nadu', language: 'ta', alternateNames: ['TN'] },
  { state: 'Puducherry', language: 'ta', alternateNames: ['PY', 'Pondicherry'] },
  
  // Kannada-speaking states
  { state: 'Karnataka', language: 'kn', alternateNames: ['KA'] },
  
  // Hindi-speaking states
  { state: 'Uttar Pradesh', language: 'hi', alternateNames: ['UP'] },
  { state: 'Madhya Pradesh', language: 'hi', alternateNames: ['MP'] },
  { state: 'Rajasthan', language: 'hi', alternateNames: ['RJ'] },
  { state: 'Bihar', language: 'hi', alternateNames: ['BR'] },
  { state: 'Jharkhand', language: 'hi', alternateNames: ['JH'] },
  { state: 'Chhattisgarh', language: 'hi', alternateNames: ['CG'] },
  { state: 'Uttarakhand', language: 'hi', alternateNames: ['UK', 'UT'] },
  { state: 'Himachal Pradesh', language: 'hi', alternateNames: ['HP'] },
  { state: 'Haryana', language: 'hi', alternateNames: ['HR'] },
  { state: 'Delhi', language: 'hi', alternateNames: ['DL', 'NCT'] },
  
  // Other states (default to English for now)
  { state: 'Maharashtra', language: 'en', alternateNames: ['MH'] },
  { state: 'Gujarat', language: 'en', alternateNames: ['GJ'] },
  { state: 'West Bengal', language: 'en', alternateNames: ['WB'] },
  { state: 'Odisha', language: 'en', alternateNames: ['OR', 'Orissa'] },
  { state: 'Kerala', language: 'en', alternateNames: ['KL'] },
  { state: 'Punjab', language: 'en', alternateNames: ['PB'] },
  { state: 'Assam', language: 'en', alternateNames: ['AS'] },
  { state: 'Goa', language: 'en', alternateNames: ['GA'] },
];

export class LanguageDetectionService {
  private static instance: LanguageDetectionService;

  private constructor() {}

  static getInstance(): LanguageDetectionService {
    if (!LanguageDetectionService.instance) {
      LanguageDetectionService.instance = new LanguageDetectionService();
    }
    return LanguageDetectionService.instance;
  }

  /**
   * Detect language based on current GPS location
   */
  async detectLanguageFromLocation(): Promise<Language> {
    try {
      console.log('🌍 [LANGUAGE DETECTION] Starting language detection from location...');
      
      const locationService = LocationService.getInstance();
      
      // Get current location
      const location = await locationService.getCurrentLocation();
      console.log('📍 [LANGUAGE DETECTION] Got location:', {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });

      // Get address from reverse geocoding
      const address = await locationService.reverseGeocode(
        location.coords.latitude,
        location.coords.longitude
      );

      console.log('🏠 [LANGUAGE DETECTION] Address:', address);

      // Extract state from address
      const detectedState = address.region || address.state;
      console.log('🗺️ [LANGUAGE DETECTION] Detected state:', detectedState);

      if (!detectedState) {
        console.warn('⚠️ [LANGUAGE DETECTION] No state detected, defaulting to English');
        return 'en';
      }

      // Map state to language
      const language = this.mapStateToLanguage(detectedState);
      console.log('✅ [LANGUAGE DETECTION] Detected language:', language);

      return language;
    } catch (error) {
      console.error('❌ [LANGUAGE DETECTION] Error detecting language:', error);
      // Default to English on error
      return 'en';
    }
  }

  /**
   * Map state name to language
   */
  private mapStateToLanguage(stateName: string): Language {
    const normalizedState = stateName.trim().toLowerCase();

    // Find matching state in the map
    for (const mapping of STATE_LANGUAGE_MAP) {
      const stateMatch = mapping.state.toLowerCase() === normalizedState;
      const alternateMatch = mapping.alternateNames?.some(
        (alt) => alt.toLowerCase() === normalizedState
      );

      if (stateMatch || alternateMatch) {
        console.log(`🎯 [LANGUAGE DETECTION] Matched state "${stateName}" to language "${mapping.language}"`);
        return mapping.language;
      }
    }

    // Check if state name contains any of the mapped states
    for (const mapping of STATE_LANGUAGE_MAP) {
      if (normalizedState.includes(mapping.state.toLowerCase())) {
        console.log(`🎯 [LANGUAGE DETECTION] Partial match: "${stateName}" contains "${mapping.state}", using language "${mapping.language}"`);
        return mapping.language;
      }
    }

    console.warn(`⚠️ [LANGUAGE DETECTION] No language mapping found for state "${stateName}", defaulting to English`);
    return 'en';
  }

  /**
   * Get language name in native script
   */
  getLanguageNativeName(language: Language): string {
    const names: { [key in Language]: string } = {
      en: 'English',
      te: 'తెలుగు',
      hi: 'हिंदी',
      ta: 'தமிழ்',
      kn: 'ಕನ್ನಡ',
      null: 'English',
    };
    return names[language || 'en'];
  }
}

export const languageDetectionService = LanguageDetectionService.getInstance();

