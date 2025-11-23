// Conversation State Service - Manage multi-turn conversations and track field completion
// This service maintains the state of ongoing conversations and tracks which form fields have been filled

import { FormDefinition, FormField } from '@/config/form-definitions';

export interface FieldValue {
  fieldName: string;
  value: any;
  confirmed: boolean;
}

export interface ConversationState {
  screenName: string;
  formDefinition: FormDefinition;
  filledFields: Map<string, FieldValue>;
  currentFieldIndex: number;
  isComplete: boolean;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    message: string;
    timestamp: number;
  }>;
}

class ConversationStateService {
  private static instance: ConversationStateService;
  private currentState: ConversationState | null = null;

  static getInstance(): ConversationStateService {
    if (!ConversationStateService.instance) {
      ConversationStateService.instance = new ConversationStateService();
    }
    return ConversationStateService.instance;
  }

  /**
   * Start a new conversation for a form
   */
  startConversation(formDefinition: FormDefinition): void {
    console.log('🎬 [CONVERSATION] Starting conversation for:', formDefinition.screenName);
    
    this.currentState = {
      screenName: formDefinition.screenName,
      formDefinition,
      filledFields: new Map(),
      currentFieldIndex: 0,
      isComplete: false,
      conversationHistory: [],
    };
  }

  /**
   * Get the current conversation state
   */
  getState(): ConversationState | null {
    return this.currentState;
  }

  /**
   * Get the next field that needs to be filled
   */
  getNextField(): FormField | null {
    if (!this.currentState) return null;

    const { formDefinition, currentFieldIndex } = this.currentState;
    
    if (currentFieldIndex >= formDefinition.fields.length) {
      return null;
    }

    return formDefinition.fields[currentFieldIndex];
  }

  /**
   * Set a field value
   */
  setFieldValue(fieldName: string, value: any, confirmed: boolean = false): void {
    if (!this.currentState) return;

    console.log(`📝 [CONVERSATION] Setting field ${fieldName}:`, value);
    
    this.currentState.filledFields.set(fieldName, {
      fieldName,
      value,
      confirmed,
    });

    // Move to next field if current field is confirmed
    if (confirmed) {
      this.currentState.currentFieldIndex++;
      this.checkCompletion();
    }
  }

  /**
   * Get a field value
   */
  getFieldValue(fieldName: string): any {
    if (!this.currentState) return null;
    return this.currentState.filledFields.get(fieldName)?.value;
  }

  /**
   * Get all filled fields
   */
  getAllFieldValues(): Record<string, any> {
    if (!this.currentState) return {};

    const values: Record<string, any> = {};
    this.currentState.filledFields.forEach((fieldValue, fieldName) => {
      values[fieldName] = fieldValue.value;
    });
    return values;
  }

  /**
   * Check if all required fields are filled
   */
  private checkCompletion(): void {
    if (!this.currentState) return;

    const { formDefinition, filledFields } = this.currentState;
    const requiredFields = formDefinition.fields.filter(f => f.required);
    
    const allRequiredFilled = requiredFields.every(field => 
      filledFields.has(field.name) && filledFields.get(field.name)?.confirmed
    );

    if (allRequiredFilled) {
      console.log('✅ [CONVERSATION] All required fields filled!');
      this.currentState.isComplete = true;
    }
  }

  /**
   * Check if conversation is complete
   */
  isComplete(): boolean {
    return this.currentState?.isComplete || false;
  }

  /**
   * Add a message to conversation history
   */
  addMessage(role: 'user' | 'assistant', message: string): void {
    if (!this.currentState) return;

    this.currentState.conversationHistory.push({
      role,
      message,
      timestamp: Date.now(),
    });
  }

  /**
   * Get conversation history
   */
  getHistory(): Array<{ role: 'user' | 'assistant'; message: string; timestamp: number }> {
    return this.currentState?.conversationHistory || [];
  }

  /**
   * Clear the current conversation
   */
  clearConversation(): void {
    console.log('🧹 [CONVERSATION] Clearing conversation');
    this.currentState = null;
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    if (!this.currentState) return 0;

    const { formDefinition, filledFields } = this.currentState;
    const requiredFields = formDefinition.fields.filter(f => f.required);
    const filledRequiredFields = requiredFields.filter(f => 
      filledFields.has(f.name) && filledFields.get(f.name)?.confirmed
    );

    return (filledRequiredFields.length / requiredFields.length) * 100;
  }
}

export const conversationStateService = ConversationStateService.getInstance();

