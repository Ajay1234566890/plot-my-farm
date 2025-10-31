// Web polyfill for expo-haptics
// Haptics don't work on web, so we provide no-op implementations

export enum ImpactFeedbackStyle {
  Light = 'light',
  Medium = 'medium',
  Heavy = 'heavy',
}

export enum NotificationFeedbackType {
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

export enum SelectionFeedbackType {
  Selection = 'selection',
}

export const impactAsync = async (style?: ImpactFeedbackStyle): Promise<void> => {
  // No-op on web - haptics don't work in browsers
  console.log(`[Haptics] Impact feedback (${style}) - not supported on web`);
  return Promise.resolve();
};

export const notificationAsync = async (type?: NotificationFeedbackType): Promise<void> => {
  // No-op on web - haptics don't work in browsers
  console.log(`[Haptics] Notification feedback (${type}) - not supported on web`);
  return Promise.resolve();
};

export const selectionAsync = async (): Promise<void> => {
  // No-op on web - haptics don't work in browsers
  console.log('[Haptics] Selection feedback - not supported on web');
  return Promise.resolve();
};

// Default export for compatibility
export default {
  ImpactFeedbackStyle,
  NotificationFeedbackType,
  SelectionFeedbackType,
  impactAsync,
  notificationAsync,
  selectionAsync,
};
