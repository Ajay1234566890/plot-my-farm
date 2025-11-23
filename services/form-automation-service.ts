// Form Automation Service - Programmatically fill form fields based on voice responses
// This service handles the automation of form filling using voice input

import { FormField, FieldType } from '@/config/form-definitions';

export interface FormFieldRef {
  fieldName: string;
  setValue: (value: any) => void;
  getValue: () => any;
}

class FormAutomationService {
  private static instance: FormAutomationService;
  private fieldRefs: Map<string, FormFieldRef> = new Map();

  static getInstance(): FormAutomationService {
    if (!FormAutomationService.instance) {
      FormAutomationService.instance = new FormAutomationService();
    }
    return FormAutomationService.instance;
  }

  /**
   * Register a form field for automation
   */
  registerField(screenName: string, fieldName: string, setValue: (value: any) => void, getValue: () => any): void {
    const key = `${screenName}:${fieldName}`;
    console.log('📋 [FORM-AUTO] Registering field:', key);
    
    this.fieldRefs.set(key, {
      fieldName,
      setValue,
      getValue,
    });
  }

  /**
   * Unregister a form field
   */
  unregisterField(screenName: string, fieldName: string): void {
    const key = `${screenName}:${fieldName}`;
    console.log('🗑️ [FORM-AUTO] Unregistering field:', key);
    this.fieldRefs.delete(key);
  }

  /**
   * Unregister all fields for a screen
   */
  unregisterScreen(screenName: string): void {
    console.log('🗑️ [FORM-AUTO] Unregistering all fields for screen:', screenName);
    const keysToDelete: string[] = [];
    
    this.fieldRefs.forEach((_, key) => {
      if (key.startsWith(`${screenName}:`)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.fieldRefs.delete(key));
  }

  /**
   * Set a field value
   */
  setFieldValue(screenName: string, fieldName: string, value: any): boolean {
    const key = `${screenName}:${fieldName}`;
    const fieldRef = this.fieldRefs.get(key);

    if (!fieldRef) {
      console.warn(`⚠️ [FORM-AUTO] Field not found: ${key}`);
      return false;
    }

    try {
      console.log(`✅ [FORM-AUTO] Setting ${key} =`, value);
      fieldRef.setValue(value);
      return true;
    } catch (error) {
      console.error(`❌ [FORM-AUTO] Error setting ${key}:`, error);
      return false;
    }
  }

  /**
   * Get a field value
   */
  getFieldValue(screenName: string, fieldName: string): any {
    const key = `${screenName}:${fieldName}`;
    const fieldRef = this.fieldRefs.get(key);

    if (!fieldRef) {
      console.warn(`⚠️ [FORM-AUTO] Field not found: ${key}`);
      return null;
    }

    return fieldRef.getValue();
  }

  /**
   * Parse voice input to appropriate field value
   */
  parseVoiceInput(voiceInput: string, fieldType: FieldType, options?: string[]): any {
    const input = voiceInput.toLowerCase().trim();

    switch (fieldType) {
      case 'text':
      case 'textarea':
        return voiceInput.trim();

      case 'email':
        // Extract email from voice input
        const emailMatch = voiceInput.match(/[\w.-]+@[\w.-]+\.\w+/);
        return emailMatch ? emailMatch[0] : voiceInput.trim();

      case 'phone':
        // Extract digits from voice input
        const digits = voiceInput.replace(/\D/g, '');
        return digits;

      case 'number':
        // Extract number from voice input
        const numberMatch = voiceInput.match(/\d+(\.\d+)?/);
        return numberMatch ? parseFloat(numberMatch[0]) : null;

      case 'date':
        return this.parseDate(voiceInput);

      case 'dropdown':
        return this.matchDropdownOption(voiceInput, options || []);

      case 'image':
        // For image, return boolean indicating if user wants to add image
        return input.includes('yes') || input.includes('add') || input.includes('upload');

      default:
        return voiceInput.trim();
    }
  }

  /**
   * Parse date from voice input
   */
  private parseDate(voiceInput: string): string {
    const input = voiceInput.toLowerCase();
    const today = new Date();

    if (input.includes('today')) {
      return today.toISOString().split('T')[0];
    }

    if (input.includes('yesterday')) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString().split('T')[0];
    }

    if (input.includes('tomorrow')) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }

    // Try to extract date pattern (DD/MM/YYYY or DD-MM-YYYY)
    const dateMatch = voiceInput.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (dateMatch) {
      const [, day, month, year] = dateMatch;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    return voiceInput.trim();
  }

  /**
   * Match voice input to dropdown option
   */
  private matchDropdownOption(voiceInput: string, options: string[]): string {
    const input = voiceInput.toLowerCase();

    // Direct match
    const directMatch = options.find(opt => opt.toLowerCase() === input);
    if (directMatch) return directMatch;

    // Partial match
    const partialMatch = options.find(opt => 
      input.includes(opt.toLowerCase()) || opt.toLowerCase().includes(input)
    );
    if (partialMatch) return partialMatch;

    // Fuzzy match for common variations
    const fuzzyMatches: Record<string, string[]> = {
      'kg': ['kilogram', 'kilograms', 'kilo', 'kilos'],
      'quintal': ['quintals', 'quintal'],
      'ton': ['tons', 'tonne', 'tonnes'],
      'bag': ['bags', 'sack', 'sacks'],
    };

    for (const [option, variations] of Object.entries(fuzzyMatches)) {
      if (variations.some(v => input.includes(v))) {
        const matchedOption = options.find(opt => opt.toLowerCase() === option);
        if (matchedOption) return matchedOption;
      }
    }

    return options[0]; // Default to first option
  }
}

export const formAutomationService = FormAutomationService.getInstance();

