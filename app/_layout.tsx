import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { WeatherProvider } from "@/contexts/weather-context";
import "@/global.css";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <WeatherProvider>
        <GluestackUIProvider mode="dark">
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <RootLayoutNav />
            <StatusBar style="auto" />
          </ThemeProvider>
        </GluestackUIProvider>
      </WeatherProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { isSignedIn, isLoading, hasSeenSplash } = useAuth();

  if (isLoading) {
    return null; // Show splash screen or loading indicator
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Always register index screen for navigation routing */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Onboarding Flow */}
      {!hasSeenSplash && <Stack.Screen name="splash" options={{ headerShown: false }} />}
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
    </Stack>
  );
}
