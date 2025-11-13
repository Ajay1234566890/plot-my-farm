import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { OffersProvider } from "@/contexts/offers-context";
import { WeatherProvider } from "@/contexts/weather-context";
import "@/global.css";
import { useColorScheme } from "@/hooks/use-color-scheme";
import "@/i18n/config"; // Initialize i18n
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <WeatherProvider>
        <OffersProvider>
          <GluestackUIProvider mode="dark">
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
              <RootLayoutNav />
              <StatusBar style="auto" />
            </ThemeProvider>
          </GluestackUIProvider>
        </OffersProvider>
      </WeatherProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { isLoading } = useAuth();

  useEffect(() => {
    console.log('🎬 [LAYOUT] isLoading changed:', isLoading);
    if (!isLoading) {
      // Hide the splash screen once the app is ready
      console.log('🎬 [LAYOUT] Hiding splash screen...');
      SplashScreen.hideAsync()
        .then(() => {
          console.log('✅ [LAYOUT] Splash screen hidden successfully');
        })
        .catch((error) => {
          console.error('❌ [LAYOUT] Failed to hide splash screen:', error);
        });
    }
  }, [isLoading]);

  if (isLoading) {
    console.log('⏳ [LAYOUT] Still loading, showing splash screen...');
    return null; // Show splash screen or loading indicator
  }

  console.log('✅ [LAYOUT] Loading complete, rendering navigation stack');

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Always register index screen for navigation routing */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Onboarding Flow */}
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="select-role" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="farmer-registration" options={{ headerShown: false }} />
      <Stack.Screen name="buyer-profile-setup" options={{ headerShown: false }} />

      {/* App Screens - Always register for navigation */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />

      {/* Farmer Screens */}
      <Stack.Screen name="farmer-home" options={{ headerShown: false }} />
      <Stack.Screen name="farmer-profile-setup" options={{ headerShown: false }} />
      <Stack.Screen name="farmer-details" options={{ headerShown: false }} />
      <Stack.Screen name="farmer-weather" options={{ headerShown: false }} />
      <Stack.Screen name="farmer-offers" options={{ headerShown: false }} />

      {/* Buyer Screens */}
      <Stack.Screen name="buyer-home" options={{ headerShown: false }} />

      {/* Farm Management */}
      <Stack.Screen name="my-farms" options={{ headerShown: false }} />
      <Stack.Screen name="add-crop" options={{ headerShown: false }} />
      <Stack.Screen name="add-edit-crop" options={{ headerShown: false }} />
      <Stack.Screen name="edit-crop" options={{ headerShown: false }} />
      <Stack.Screen name="crop-details" options={{ headerShown: false }} />
      <Stack.Screen name="soil-test" options={{ headerShown: false }} />

      {/* Market & Pricing */}
      <Stack.Screen name="market-prices" options={{ headerShown: false }} />
      <Stack.Screen name="market-real-prices" options={{ headerShown: false }} />
      <Stack.Screen name="buyer-market-prices" options={{ headerShown: false }} />
      <Stack.Screen name="nearby-crops" options={{ headerShown: false }} />
      <Stack.Screen name="nearby-farms" options={{ headerShown: false }} />
      <Stack.Screen name="nearby-farmers" options={{ headerShown: false }} />
      <Stack.Screen name="nearby-buyers" options={{ headerShown: false }} />
      <Stack.Screen name="new-arrivals" options={{ headerShown: false }} />

      {/* Orders & Cart */}
      <Stack.Screen name="cart" options={{ headerShown: false }} />
      <Stack.Screen name="checkout" options={{ headerShown: false }} />
      <Stack.Screen name="order-confirmation" options={{ headerShown: false }} />
      <Stack.Screen name="my-orders" options={{ headerShown: false }} />
      <Stack.Screen name="track-order" options={{ headerShown: false }} />

      {/* Transport */}
      <Stack.Screen name="transport" options={{ headerShown: false }} />
      <Stack.Screen name="transport-details" options={{ headerShown: false }} />
      <Stack.Screen name="transport-confirmation" options={{ headerShown: false }} />
      <Stack.Screen name="contact-driver" options={{ headerShown: false }} />

      {/* Communication */}
      <Stack.Screen name="messages" options={{ headerShown: false }} />
      <Stack.Screen name="chat-screen" options={{ headerShown: false }} />
      <Stack.Screen name="voice-ai" options={{ headerShown: false }} />
      <Stack.Screen name="buyer-voice-ai" options={{ headerShown: false }} />

      {/* User Management */}
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />

      {/* Additional Features */}
      <Stack.Screen name="insights" options={{ headerShown: false }} />
      <Stack.Screen name="weather" options={{ headerShown: false }} />
      <Stack.Screen name="offers" options={{ headerShown: false }} />
      <Stack.Screen name="buyer-offers" options={{ headerShown: false }} />
      <Stack.Screen name="add-offer" options={{ headerShown: false }} />
      <Stack.Screen name="wishlist" options={{ headerShown: false }} />

      {/* Map Integration */}
      <Stack.Screen name="map-test" options={{ headerShown: false }} />
    </Stack>
  );
}
