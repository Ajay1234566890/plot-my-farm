# React Native Expo App - Navigation Structure Analysis

## 1. Navigation Library & Setup

### Primary Navigation Library: **Expo Router**
- **Type**: File-based routing system
- **Version**: 6.0.12
- **Configuration**: Defined in `app.json` with `expo-router` plugin
- **Deep Linking**: Enabled with scheme `"myapp"` in app.json

### Secondary Library: **React Navigation**
- **Purpose**: Theme management and navigation context
- **Version**: 7.1.18
- **Used for**: `ThemeProvider`, `DarkTheme`, `DefaultTheme`

### Root Layout Configuration (`app/_layout.tsx`)
```
RootLayout (Stack Navigator)
├── (tabs) - Tab Navigator [headerShown: false]
└── modal - Modal Screen [presentation: "modal"]
```

---

## 2. Navigation Hierarchy

### Root Level: Stack Navigator
- **Entry Point**: `app/_layout.tsx`
- **Screens**:
  1. `(tabs)` - Tab-based navigation (default)
  2. `modal` - Modal presentation screen

### Tab Navigator: `app/(tabs)/_layout.tsx`
Two main tabs with bottom tab bar:
1. **Home Tab** (`app/(tabs)/index.tsx`)
   - Icon: house.fill
   - Title: "Home"
   
2. **Explore Tab** (`app/(tabs)/explore.tsx`)
   - Icon: paperplane.fill
   - Title: "Explore"

### Root-Level Screens (Non-Tab Routes)
**Authentication & Onboarding**:
- `/login` - Login screen with OTP verification
- `/select-role` - Role selection (Farmer/Buyer)
- `/farmer-registration` - Multi-step farmer registration
- `/buyer-profile-setup` - Buyer profile setup
- `/farmer-profile-setup` - Farmer profile setup

**Farmer Features**:
- `/farmer-home` - Farmer dashboard
- `/my-farms` - List of farmer's farms
- `/add-crop` - Add new crop
- `/edit-crop` - Edit existing crop
- `/add-offer` - Create crop offer
- `/farmer-offers` - View farmer's offers
- `/farmer-weather` - Weather information
- `/crop-details` - Detailed crop information

**Buyer Features**:
- `/buyer-home` - Buyer dashboard
- `/nearby-crops` - Find nearby crops
- `/nearby-farmers` - Find nearby farmers
- `/nearby-farms` - Find nearby farms
- `/nearby-buyers` - Find nearby buyers

**Market & Pricing**:
- `/market-prices` - Market price information
- `/market-real-prices` - Real-time market prices
- `/new-arrivals` - New crop arrivals

**Orders & Transactions**:
- `/my-orders` - User's orders
- `/order-confirmation` - Order confirmation screen
- `/checkout` - Checkout process
- `/cart` - Shopping cart

**Transport & Logistics**:
- `/transport` - Transport options
- `/transport-details` - Transport details
- `/transport-confirmation` - Transport confirmation
- `/contact-driver` - Contact driver

**Communication & Notifications**:
- `/messages` - Messaging screen
- `/chat-screen` - Chat interface
- `/notifications` - Notifications list

**User Management**:
- `/profile` - User profile
- `/settings` - App settings
- `/farmer-details` - Farmer details view

**Additional Features**:
- `/voice-ai` - Voice AI assistant
- `/weather` - Weather information
- `/soil-test` - Soil testing information
- `/insights` - Analytics/insights
- `/wishlist` - Wishlist
- `/track-order` - Order tracking
- `/offers` - View offers
- `/index` - Root home screen

---

## 3. Navigation Flow Patterns

### Authentication Flow
```
/index (Root)
  ↓
/login (Mobile + OTP)
  ↓
/select-role (Choose Farmer/Buyer)
  ↓
/farmer-registration OR /buyer-profile-setup
  ↓
/farmer-home OR /buyer-home (Main Dashboard)
```

### Farmer User Journey
```
/farmer-home (Dashboard)
├── Quick Actions:
│   ├── /farmer-weather (Weather)
│   ├── /market-prices (Market)
│   ├── /add-offer (Add Offer)
│   └── /nearby-buyers (Nearby Buyers)
├── Bottom Navigation:
│   ├── Home → /farmer-home
│   ├── My Farms → /my-farms
│   ├── Voice → /voice-ai
│   ├── Messages → /messages
│   └── Profile → /profile
└── Crop Management:
    ├── /add-crop
    ├── /edit-crop
    ├── /crop-details
    └── /my-farms
```

### Buyer User Journey
```
/buyer-home (Dashboard)
├── Tabs:
│   ├── Nearby Crops
│   └── Nearby Farmers
├── Quick Actions:
│   ├── /offers (View Offers)
│   ├── /transport (Transport)
│   ├── /new-arrivals (New Arrivals)
│   ├── /track-order (Track Order)
│   └── /nearby-crops (Browse Crops)
├── Bottom Navigation:
│   ├── Home → /buyer-home
│   ├── Crops → /nearby-crops
│   ├── Voice → /voice-ai
│   ├── Orders → /my-orders
│   └── Profile → /profile
└── Purchase Flow:
    ├── /nearby-crops
    ├── /crop-details
    ├── /cart
    ├── /checkout
    └── /order-confirmation
```

---

## 4. Navigation Implementation Details

### Navigation Methods Used

**1. Programmatic Navigation (useRouter hook)**
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/farmer-home');      // Navigate to screen
router.back();                     // Go back
router.replace('/login');          // Replace current screen
```

**2. Link Component (Expo Router)**
```typescript
import { Link } from 'expo-router';

<Link href="/modal">
  <Text>Go to Modal</Text>
</Link>
```

### Navigation Parameters
- Currently: No complex parameter passing observed
- Routes are simple path-based navigation
- State management appears to be local component state

### Modal Presentation
- **Screen**: `/modal`
- **Presentation Style**: `"modal"` (full-screen modal)
- **Dismissal**: Using `dismissTo` prop in Link component

---

## 5. Custom Navigation Components

### Bottom Tab Navigation
- **Location**: `app/bottom-tabs.tsx`
- **Purpose**: Custom bottom tab bar component
- **Tabs**: Home, My Farms, Voice (center), Messages, Profile
- **Implementation**: Manual TouchableOpacity buttons (not using Tabs.Screen)

### Haptic Tab Component
- **Location**: `components/haptic-tab.tsx`
- **Purpose**: Provides haptic feedback on tab press
- **Used in**: `app/(tabs)/_layout.tsx` as `tabBarButton`

---

## 6. Deep Linking Configuration

### app.json Configuration
```json
{
  "expo": {
    "scheme": "myapp",
    "plugins": ["expo-router"]
  }
}
```

### Deep Link Scheme
- **Scheme**: `myapp://`
- **Example**: `myapp://farmer-home`, `myapp://my-farms`
- **Status**: Configured but no explicit route mapping found

---

## 7. Screen Organization Summary

| Category | Count | Examples |
|----------|-------|----------|
| Authentication | 4 | login, select-role, farmer-registration, buyer-profile-setup |
| Farmer Features | 8 | farmer-home, my-farms, add-crop, farmer-weather |
| Buyer Features | 4 | buyer-home, nearby-crops, nearby-farmers, nearby-farms |
| Market/Pricing | 3 | market-prices, market-real-prices, new-arrivals |
| Orders/Cart | 4 | my-orders, order-confirmation, checkout, cart |
| Transport | 3 | transport, transport-details, transport-confirmation |
| Communication | 3 | messages, chat-screen, notifications |
| User Management | 3 | profile, settings, farmer-details |
| Other | 5 | voice-ai, weather, soil-test, insights, wishlist |
| **Total** | **47** | |

---

## 8. Key Navigation Insights

### Strengths
✅ File-based routing simplifies structure
✅ Clear separation between farmer and buyer flows
✅ Consistent use of `useRouter` hook
✅ Modal presentation properly configured
✅ Deep linking scheme configured

### Areas for Improvement
⚠️ No typed route parameters (could use Expo Router's typed routes)
⚠️ Bottom navigation manually implemented in each screen
⚠️ No centralized navigation state management
⚠️ Navigation parameters not utilized
⚠️ No error boundaries for navigation failures

### Recommendations
1. Implement typed routes using Expo Router's `typedRoutes` experiment
2. Create a shared bottom navigation component
3. Add navigation parameter passing for data flow
4. Implement proper error handling for navigation
5. Consider Redux/Zustand for complex state management

