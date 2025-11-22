export interface TaskHandlerResult {
  success: boolean;
  data?: any;
  navigateTo?: string;
  message?: string;
}

export interface TaskContext {
  userId: string;
  userRole: 'farmer' | 'buyer';
  language: string;
  userData?: any;
}

// Task Handlers for different workflows
class TaskHandlersService {

  // Registration handlers
  async handleFarmerRegistration(context: TaskContext, data: any): Promise<TaskHandlerResult> {
    try {
      // For farmer registration, navigate to farmer registration screen
      return {
        success: true,
        navigateTo: '/farmer-registration',
        message: 'I will help you register as a farmer. Let me take you to the registration screen.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Sorry, I encountered an error setting up your farmer registration.'
      };
    }
  }

  async handleBuyerRegistration(context: TaskContext, data: any): Promise<TaskHandlerResult> {
    try {
      // For buyer registration, navigate to buyer profile setup screen
      return {
        success: true,
        navigateTo: '/buyer-profile-setup',
        message: 'I will help you register as a buyer. Let me take you to the registration screen.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Sorry, I encountered an error setting up your buyer registration.'
      };
    }
  }

  // Crop management handlers
  async handleAddCrop(context: TaskContext, data: any): Promise<TaskHandlerResult> {
    try {
      return {
        success: true,
        navigateTo: '/add-crop',
        message: 'Let me help you add a new crop to your farm.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Sorry, I encountered an error opening the crop management screen.'
      };
    }
  }

  async handleViewMyCrops(context: TaskContext): Promise<TaskHandlerResult> {
    try {
      return {
        success: true,
        navigateTo: '/my-farms',
        message: 'Let me show you your crops and farms.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Sorry, I encountered an error accessing your crop data.'
      };
    }
  }

  // Market and pricing handlers
  async handleViewMarketPrices(context: TaskContext): Promise<TaskHandlerResult> {
    try {
      const route = context.userRole === 'farmer' ? '/market-real-prices' : '/buyer-market-prices';
      return {
        success: true,
        navigateTo: route,
        message: 'Here are the current market prices for various crops.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Sorry, I encountered an error fetching market prices.'
      };
    }
  }

  // Location-based handlers
  async handleFindAvailableBuyers(context: TaskContext): Promise<TaskHandlerResult> {
    try {
      return {
        success: true,
        navigateTo: '/nearby-buyers',
        message: 'Let me find buyers available near you.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Sorry, I encountered an error finding nearby buyers.'
      };
    }
  }

  async handleFindNearbyFarmers(context: TaskContext): Promise<TaskHandlerResult> {
    try {
      return {
        success: true,
        navigateTo: '/nearby-farmers',
        message: 'Let me find farmers near you with available crops.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Sorry, I encountered an error finding nearby farmers.'
      };
    }
  }

  // Weather information handlers
  async handleViewWeather(context: TaskContext): Promise<TaskHandlerResult> {
    try {
      return {
        success: true,
        navigateTo: '/farmer-weather',
        message: 'Let me show you the weather forecast for your area.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Sorry, I encountered an error fetching weather data.'
      };
    }
  }

  // Offers and orders handlers
  async handleViewMyOffers(context: TaskContext): Promise<TaskHandlerResult> {
    try {
      const route = context.userRole === 'farmer' ? '/farmer-offers' : '/buyer-offers';
      return {
        success: true,
        navigateTo: route,
        message: context.userRole === 'farmer'
          ? 'Let me show you your current offers and proposals.'
          : 'Let me show you available offers from farmers.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Sorry, I encountered an error accessing your offers.'
      };
    }
  }

  async handleViewMyOrders(context: TaskContext): Promise<TaskHandlerResult> {
    try {
      return {
        success: true,
        navigateTo: '/my-orders',
        message: 'Let me show you your current orders.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Sorry, I encountered an error accessing your orders.'
      };
    }
  }

  async handleViewCart(context: TaskContext): Promise<TaskHandlerResult> {
    try {
      return {
        success: true,
        navigateTo: '/cart',
        message: 'Let me show you your cart items.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Sorry, I encountered an error accessing your cart.'
      };
    }
  }

  // Generic handler dispatcher
  async executeTask(taskType: string, context: TaskContext, data?: any): Promise<TaskHandlerResult> {
    const handlers: { [key: string]: (ctx: TaskContext, data?: any) => Promise<TaskHandlerResult> } = {
      // Registration tasks
      'farmer_registration': this.handleFarmerRegistration,
      'buyer_registration': this.handleBuyerRegistration,

      // Crop management tasks
      'add_crop': this.handleAddCrop,
      'view_crops': this.handleViewMyCrops,

      // Market tasks
      'market_prices': this.handleViewMarketPrices,

      // Location tasks
      'find_buyers': this.handleFindAvailableBuyers,
      'find_farmers': this.handleFindNearbyFarmers,

      // Weather tasks
      'weather': this.handleViewWeather,

      // Offers and orders
      'my_offers': this.handleViewMyOffers,
      'my_orders': this.handleViewMyOrders,
      'cart': this.handleViewCart,
    };

    const handler = handlers[taskType];
    if (!handler) {
      return {
        success: false,
        message: `I don't know how to handle the task: ${taskType}`
      };
    }

    return await handler(context, data);
  }
}

export const taskHandlersService = new TaskHandlersService();
