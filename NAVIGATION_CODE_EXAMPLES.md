# Navigation Code Examples & Implementation Patterns

## 1. Basic Navigation Setup

### Root Layout (`app/_layout.tsx`)
```typescript
import { Stack } from "expo-router";
import { ThemeProvider } from "@react-navigation/native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider mode="dark">
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
```

### Tab Layout (`app/(tabs)/_layout.tsx`)
```typescript
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
```

---

## 2. Navigation Methods

### Method 1: useRouter Hook (Programmatic)
```typescript
import { useRouter } from 'expo-router';

export default function FarmerHome() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push('/add-crop')}>
      <Text>Add New Crop</Text>
    </TouchableOpacity>
  );
}
```

### Method 2: Link Component
```typescript
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <Link href="/modal">
      <Text>Open Modal</Text>
    </Link>
  );
}
```

### Method 3: Back Navigation
```typescript
const router = useRouter();

<TouchableOpacity onPress={() => router.back()}>
  <ArrowLeft size={24} />
</TouchableOpacity>
```

### Method 4: Replace Navigation
```typescript
// Replace current screen instead of pushing
router.replace('/login');
```

---

## 3. Common Navigation Patterns

### Pattern 1: Authentication Flow
```typescript
// Login Screen
const handleVerifyOTP = () => {
  // Verify OTP with API
  if (isValid) {
    router.push('/select-role');
  }
};

// Select Role Screen
const handleContinue = () => {
  if (selectedRole === 'farmer') {
    router.push('/farmer-registration');
  } else {
    router.push('/buyer-profile-setup');
  }
};

// After Registration
const handleCompleteRegistration = () => {
  router.push('/farmer-home');
};
```

### Pattern 2: Quick Actions Navigation
```typescript
// From farmer-home.tsx
const quickActions = [
  {
    icon: <CloudSun size={24} />,
    label: "Weather",
    route: "/farmer-weather",
  },
  {
    icon: <TrendingUp size={24} />,
    label: "Market",
    route: "/market-prices",
  },
];

{quickActions.map((action, index) => (
  <TouchableOpacity
    key={index}
    onPress={() => router.push(action.route)}
  >
    <Text>{action.label}</Text>
  </TouchableOpacity>
))}
```

### Pattern 3: Bottom Navigation
```typescript
// Custom bottom navigation in each screen
<View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
  <View className="flex-row items-center justify-between px-3 pb-6 pt-2">
    <TouchableOpacity onPress={() => router.push('/farmer-home')}>
      <Home size={24} color="#16a34a" />
      <Text className="text-xs text-green-600 mt-1">Home</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => router.push('/my-farms')}>
      <Sprout size={24} color="#6b7280" />
      <Text className="text-xs text-gray-500 mt-1">My Farms</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => router.push('/voice-ai')}>
      <Mic size={28} color="white" />
    </TouchableOpacity>

    <TouchableOpacity onPress={() => router.push('/messages')}>
      <MessageCircle size={24} color="#6b7280" />
      <Text className="text-xs text-gray-500 mt-1">Messages</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => router.push('/profile')}>
      <User size={24} color="#6b7280" />
      <Text className="text-xs text-gray-500 mt-1">Profile</Text>
    </TouchableOpacity>
  </View>
</View>
```

### Pattern 4: Conditional Navigation
```typescript
// From farmer-registration.tsx
const handleBackPress = () => {
  if (step === 'otp') {
    setStep('details');
  } else if (step === 'profile') {
    setStep('otp');
  } else {
    router.back();
  }
};
```

### Pattern 5: Modal Navigation
```typescript
// Open modal
<Link href="/modal">
  <Text>Open Modal</Text>
</Link>

// Close modal
<Link href="/" dismissTo>
  <Text>Close Modal</Text>
</Link>
```

---

## 4. Navigation with State

### Current Implementation (Local State)
```typescript
// Each screen manages its own state
export default function MyFarms() {
  const [selectedFarm, setSelectedFarm] = useState(null);
  const router = useRouter();

  const handleFarmPress = (farm) => {
    setSelectedFarm(farm);
    // Navigate without passing data
    router.push('/crop-details');
  };

  return (
    // UI using selectedFarm state
  );
}
```

### Recommended: Navigation with Parameters
```typescript
// Better approach (not currently implemented)
const handleFarmPress = (farm) => {
  router.push({
    pathname: '/crop-details',
    params: { 
      farmId: farm.id,
      cropId: farm.crops[0].id 
    }
  });
};

// In crop-details screen
import { useLocalSearchParams } from 'expo-router';

export default function CropDetails() {
  const { farmId, cropId } = useLocalSearchParams();
  
  // Use parameters to fetch data
}
```

---

## 5. Deep Linking Configuration

### app.json Configuration
```json
{
  "expo": {
    "scheme": "myapp",
    "plugins": ["expo-router"]
  }
}
```

### Deep Link Examples
```
myapp://farmer-home
myapp://buyer-home
myapp://my-farms
myapp://nearby-crops
myapp://messages
myapp://profile
myapp://cart
myapp://checkout
```

### Handling Deep Links (Recommended)
```typescript
// In root layout or app initialization
import { useEffect } from 'react';
import * as Linking from 'expo-linking';

export default function RootLayout() {
  useEffect(() => {
    const handleDeepLink = ({ url }) => {
      const route = url.replace(/.*?:\/\//g, '');
      // Navigate to route
      router.push(route);
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  // ... rest of layout
}
```

---

## 6. Navigation Hooks & Utilities

### useRouter Hook
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Available methods:
router.push(href);           // Navigate to screen
router.back();               // Go back
router.replace(href);        // Replace current screen
router.dismiss();            // Dismiss modal
router.canGoBack();          // Check if can go back
```

### useLocalSearchParams Hook
```typescript
import { useLocalSearchParams } from 'expo-router';

export default function Screen() {
  const params = useLocalSearchParams();
  // Access route parameters
}
```

### usePathname Hook
```typescript
import { usePathname } from 'expo-router';

export default function Screen() {
  const pathname = usePathname();
  // Get current route path
}
```

---

## 7. Custom Navigation Components

### HapticTab Component
```typescript
// components/haptic-tab.tsx
import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

export function HapticTab(props) {
  return (
    <Pressable
      {...props}
      onPress={(e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        props.onPress?.(e);
      }}
    />
  );
}
```

### Bottom Navigation Component (Recommended)
```typescript
// components/bottom-navigation.tsx
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';

export function BottomNavigation() {
  const router = useRouter();

  const tabs = [
    { label: 'Home', icon: Home, route: '/farmer-home' },
    { label: 'Farms', icon: Sprout, route: '/my-farms' },
    { label: 'Voice', icon: Mic, route: '/voice-ai' },
    { label: 'Messages', icon: MessageCircle, route: '/messages' },
    { label: 'Profile', icon: User, route: '/profile' },
  ];

  return (
    <View className="flex-row justify-between">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.route}
          onPress={() => router.push(tab.route)}
        >
          <tab.icon size={24} />
          <Text>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

---

## 8. Error Handling & Edge Cases

### Safe Navigation
```typescript
// Check if route exists before navigating
const safeNavigate = (route) => {
  try {
    router.push(route);
  } catch (error) {
    console.error('Navigation error:', error);
    // Show error message to user
  }
};
```

### Prevent Duplicate Navigation
```typescript
let isNavigating = false;

const handlePress = () => {
  if (isNavigating) return;
  
  isNavigating = true;
  router.push('/next-screen');
  
  setTimeout(() => {
    isNavigating = false;
  }, 500);
};
```

### Handle Back Button
```typescript
import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export default function Screen() {
  const router = useRouter();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (router.canGoBack()) {
          router.back();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, []);
}
```

---

## 9. Best Practices

### ✅ DO
- Use `useRouter` hook for programmatic navigation
- Keep navigation logic in event handlers
- Use Link component for static links
- Handle back button properly
- Validate data before navigation
- Use typed routes (Expo Router experiment)

### ❌ DON'T
- Navigate in useEffect without dependencies
- Pass large objects through navigation
- Use navigation for state management
- Ignore back button handling
- Create circular navigation flows
- Navigate without user interaction

---

## 10. Recommended Improvements

### 1. Implement Typed Routes
```typescript
// Enable in app.json
"experiments": {
  "typedRoutes": true
}

// Then use typed navigation
router.push<'/crop-details'>({
  pathname: '/crop-details',
  params: { cropId: 123 }
});
```

### 2. Create Navigation Context
```typescript
// contexts/navigation.tsx
import { createContext } from 'react';
import { useRouter } from 'expo-router';

export const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  const router = useRouter();

  const navigate = (route, params) => {
    router.push({ pathname: route, params });
  };

  return (
    <NavigationContext.Provider value={{ navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}
```

### 3. Add Route Guards
```typescript
// middleware/auth.ts
export function withAuth(Component) {
  return function ProtectedComponent(props) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace('/login');
      }
    }, [isAuthenticated]);

    return isAuthenticated ? <Component {...props} /> : null;
  };
}
```

