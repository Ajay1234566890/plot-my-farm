// Screen Context Service - Track current screen and provide context to voice agent
// This service maintains the current screen state and provides context for conversational AI

export type ScreenName = 
  | 'select-role'
  | 'login'
  | 'farmer-registration'
  | 'buyer-profile-setup'
  | 'farmer-home'
  | 'buyer-home'
  | 'add-crop'
  | 'add-offer'
  | 'edit-crop'
  | 'my-farms'
  | 'nearby-crops'
  | 'nearby-farmers'
  | 'nearby-buyers'
  | 'cart'
  | 'checkout'
  | 'profile'
  | 'settings'
  | 'messages'
  | 'chat-screen'
  | 'track-order'
  | 'my-orders'
  | 'offers'
  | 'farmer-offers'
  | 'crop-details'
  | 'market-prices'
  | 'weather'
  | 'farmer-weather';

export interface ScreenContext {
  screenName: ScreenName;
  screenTitle: string;
  hasForm: boolean;
  formFields?: string[];
  userRole?: 'farmer' | 'buyer';
  params?: Record<string, any>;
}

type ScreenContextListener = (context: ScreenContext) => void;

class ScreenContextService {
  private static instance: ScreenContextService;
  private currentContext: ScreenContext | null = null;
  private listeners: ScreenContextListener[] = [];

  static getInstance(): ScreenContextService {
    if (!ScreenContextService.instance) {
      ScreenContextService.instance = new ScreenContextService();
    }
    return ScreenContextService.instance;
  }

  /**
   * Set the current screen context
   */
  setContext(context: ScreenContext): void {
    console.log('📍 [SCREEN-CONTEXT] Setting context:', context.screenName);
    this.currentContext = context;
    this.notifyListeners();
  }

  /**
   * Get the current screen context
   */
  getContext(): ScreenContext | null {
    return this.currentContext;
  }

  /**
   * Subscribe to context changes
   */
  subscribe(listener: ScreenContextListener): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of context change
   */
  private notifyListeners(): void {
    if (this.currentContext) {
      this.listeners.forEach(listener => listener(this.currentContext!));
    }
  }

  /**
   * Clear the current context
   */
  clearContext(): void {
    console.log('🧹 [SCREEN-CONTEXT] Clearing context');
    this.currentContext = null;
  }

  /**
   * Check if current screen has a form
   */
  hasForm(): boolean {
    return this.currentContext?.hasForm || false;
  }

  /**
   * Get form fields for current screen
   */
  getFormFields(): string[] {
    return this.currentContext?.formFields || [];
  }

  /**
   * Get screen title
   */
  getScreenTitle(): string {
    return this.currentContext?.screenTitle || 'Unknown Screen';
  }

  /**
   * Get user role from context
   */
  getUserRole(): 'farmer' | 'buyer' | undefined {
    return this.currentContext?.userRole;
  }
}

export const screenContextService = ScreenContextService.getInstance();

