import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

/**
 * Safe navigation wrapper that handles errors gracefully
 */
export const useSafeNavigation = () => {
  const router = useRouter();

  const safeNavigate = async (
    href: string,
    params?: Record<string, any>,
    onError?: (error: Error) => void
  ) => {
    try {
      if (params) {
        router.push({
          pathname: href as any,
          params,
        });
      } else {
        router.push(href as any);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('Navigation error:', err);
      if (onError) {
        onError(err);
      } else {
        Alert.alert('Navigation Error', 'Failed to navigate to the requested screen');
      }
    }
  };

  const safeReplace = async (
    href: string,
    params?: Record<string, any>,
    onError?: (error: Error) => void
  ) => {
    try {
      if (params) {
        router.replace({
          pathname: href as any,
          params,
        });
      } else {
        router.replace(href as any);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('Navigation error:', err);
      if (onError) {
        onError(err);
      } else {
        Alert.alert('Navigation Error', 'Failed to navigate to the requested screen');
      }
    }
  };

  const safeGoBack = (onError?: (error: Error) => void) => {
    try {
      if (router.canGoBack()) {
        router.back();
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('Navigation error:', err);
      if (onError) {
        onError(err);
      }
    }
  };

  return {
    safeNavigate,
    safeReplace,
    safeGoBack,
    router,
  };
};

/**
 * Prevent duplicate navigation
 */
export const usePreventDuplicateNavigation = () => {
  let isNavigating = false;

  const navigate = async (
    href: string,
    params?: Record<string, any>,
    delay: number = 500
  ) => {
    if (isNavigating) return;

    isNavigating = true;
    try {
      const router = useRouter();
      if (params) {
        router.push({
          pathname: href as any,
          params,
        });
      } else {
        router.push(href as any);
      }
    } finally {
      setTimeout(() => {
        isNavigating = false;
      }, delay);
    }
  };

  return { navigate };
};

/**
 * Handle deep linking
 */
export const parseDeepLink = (url: string) => {
  const match = url.match(/myapp:\/\/(.+?)(\?.*)?$/);
  if (!match) return null;

  const route = match[1];
  const queryString = match[2];

  const params: Record<string, any> = {};
  if (queryString) {
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
  }

  return { route, params };
};

/**
 * Navigation parameter types
 */
export interface NavigationParams {
  cropId?: string;
  farmId?: string;
  orderId?: string;
  farmerId?: string;
  buyerId?: string;
  messageId?: string;
  transportId?: string;
  [key: string]: any;
}

