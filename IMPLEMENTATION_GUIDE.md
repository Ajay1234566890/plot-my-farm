# Implementation Guide for Remaining Screens

## Quick Start

This guide provides step-by-step instructions for implementing the remaining 42 screens in the application.

---

## Architecture Overview

### State Management Pattern
```typescript
// Use auth context for user data
const { user, userRole } = useAuth();

// Use local state for screen-specific data
const [data, setData] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
```

### Navigation Pattern
```typescript
// Use safe navigation
const { safeNavigate, safeGoBack } = useSafeNavigation();

// Navigate with parameters
safeNavigate('/crop-details', { cropId: '123' });

// Get parameters
const { cropId } = useLocalSearchParams();
```

### Form Pattern
```typescript
// Validate form
const validation = validateAddCropForm(cropType, quantity, price);
if (!validation.isValid) {
  setErrors(validation.errors);
  return;
}

// Submit form
try {
  setIsLoading(true);
  // API call
  safeNavigate('/success-screen');
} catch (error) {
  setError('Failed to submit');
} finally {
  setIsLoading(false);
}
```

---

## Phase 3: Farmer Features

### 1. Farmer Home (`app/farmer-home.tsx`)
**Purpose**: Main farmer dashboard

**Components**:
- Profile card with stats
- Weather widget
- Market prices carousel
- Quick actions (Weather, Market, Add Offer, Nearby Buyers)
- Recommended buyers list
- Bottom navigation

**Implementation Steps**:
1. Import BottomNavigation component
2. Fetch user profile from auth context
3. Create mock data for stats, weather, prices
4. Implement quick action buttons with navigation
5. Add bottom navigation with variant="farmer"

**Data Structure**:
```typescript
interface FarmerStats {
  listings: number;
  orders: number;
  successRate: number;
  earnings: number;
}

interface Weather {
  temp: number;
  condition: string;
  humidity: number;
}
```

### 2. My Farms (`app/my-farms.tsx`)
**Purpose**: Display farmer's farms

**Components**:
- Farm list with images
- Farm details (location, size, crops)
- Farm statistics
- Add farm button

**Implementation Steps**:
1. Fetch farms from API (mock data for now)
2. Display farm list with FlatList
3. Implement farm card component
4. Add navigation to crop-details
5. Add bottom navigation

### 3. Add Crop (`app/add-crop.tsx`)
**Purpose**: Create new crop listing

**Form Fields**:
- Crop type (dropdown)
- Quantity
- Price per unit
- Availability dates
- Additional notes

**Implementation Steps**:
1. Create form with TextInput fields
2. Add validation using validateAddCropForm
3. Implement date picker for availability
4. Add submit button with loading state
5. Navigate to success screen

### 4. Farmer Offers (`app/farmer-offers.tsx`)
**Purpose**: View all created offers

**Components**:
- Offer list
- Offer status (Active, Expired, Sold)
- Edit/Delete options

**Implementation Steps**:
1. Fetch offers from API
2. Display offer list with status badges
3. Implement offer card component
4. Add edit/delete functionality
5. Add bottom navigation

---

## Phase 4: Buyer Features

### 1. Buyer Home (`app/buyer-home.tsx`)
**Purpose**: Main buyer dashboard

**Components**:
- Welcome message
- Search bar
- Tabs: Nearby Crops, Nearby Farmers
- Featured crops grid
- Quick actions
- Market prices
- Bottom navigation

**Implementation Steps**:
1. Import BottomNavigation component
2. Create tab navigation
3. Fetch nearby crops/farmers
4. Display featured crops grid
5. Add quick action buttons
6. Add bottom navigation with variant="buyer"

### 2. Nearby Crops (`app/nearby-crops.tsx`)
**Purpose**: Browse available crops

**Components**:
- Crop list with images
- Farmer information
- Price and availability
- Add to cart button
- Filter options

**Implementation Steps**:
1. Fetch crops from API
2. Display crop list with FlatList
3. Implement crop card component
4. Add to cart functionality
5. Add filter/search

### 3. Cart (`app/cart.tsx`)
**Purpose**: Shopping cart

**Components**:
- Cart items list
- Quantity adjustment
- Price calculation
- Proceed to checkout button

**Implementation Steps**:
1. Get cart items from state/context
2. Display items with quantity controls
3. Calculate total price
4. Implement remove item
5. Add checkout button

### 4. Checkout (`app/checkout.tsx`)
**Purpose**: Purchase process

**Form Fields**:
- Delivery address
- Payment method
- Order summary

**Implementation Steps**:
1. Display order summary
2. Create address form
3. Add payment method selection
4. Implement place order
5. Navigate to confirmation

### 5. Order Confirmation (`app/order-confirmation.tsx`)
**Purpose**: Confirm successful order

**Components**:
- Order details
- Confirmation number
- Estimated delivery
- Track order button

**Implementation Steps**:
1. Get order data from navigation params
2. Display order details
3. Generate confirmation number
4. Add track order button
5. Add back to home button

---

## Phase 5: Supporting Features

### 1. Messages (`app/messages.tsx`)
**Purpose**: Message list

**Components**:
- Conversation list
- Unread indicators
- Last message preview

**Implementation Steps**:
1. Fetch conversations from API
2. Display conversation list
3. Show unread count
4. Add new message button
5. Navigate to chat screen

### 2. Chat Screen (`app/chat-screen.tsx`)
**Purpose**: Send/receive messages

**Components**:
- Message history
- Message input
- Send button
- User information

**Implementation Steps**:
1. Get conversation ID from params
2. Fetch message history
3. Display messages
4. Implement message input
5. Add send functionality

### 3. Profile (`app/profile.tsx`)
**Purpose**: User profile

**Components**:
- Profile information
- Avatar
- Edit profile button
- Settings link
- Logout button

**Implementation Steps**:
1. Get user from auth context
2. Display profile information
3. Add edit button
4. Add settings link
5. Add logout functionality

### 4. Settings (`app/settings.tsx`)
**Purpose**: App settings

**Options**:
- Language settings
- Notification preferences
- Privacy settings
- Logout

**Implementation Steps**:
1. Create settings list
2. Implement language selection
3. Add notification toggle
4. Add logout button
5. Add privacy link

---

## Common Patterns

### Loading State
```typescript
{isLoading ? (
  <ActivityIndicator size="large" color="#16a34a" />
) : (
  // Content
)}
```

### Error Handling
```typescript
{error ? (
  <View className="bg-red-100 p-3 rounded-lg">
    <Text className="text-red-700">{error}</Text>
  </View>
) : null}
```

### List Rendering
```typescript
<FlatList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  keyExtractor={(item) => item.id}
  onEndReached={loadMore}
/>
```

### Form Submission
```typescript
const handleSubmit = async () => {
  setIsLoading(true);
  try {
    // Validate
    // API call
    // Navigate
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

---

## Testing Checklist

### For Each Screen
- [ ] Navigation works correctly
- [ ] Loading states display
- [ ] Error messages show
- [ ] Form validation works
- [ ] API calls succeed
- [ ] Bottom navigation appears
- [ ] Back button works
- [ ] Data displays correctly

### Integration Tests
- [ ] Complete user flow works
- [ ] Data persists across navigation
- [ ] Authentication required for protected screens
- [ ] Deep linking works

---

## API Integration

### Mock Data Pattern
```typescript
// Use mock data during development
const mockCrops = [
  { id: '1', name: 'Tomato', price: 50 },
  { id: '2', name: 'Wheat', price: 30 },
];

// Replace with API calls
const fetchCrops = async () => {
  try {
    const response = await fetch('https://api.example.com/crops');
    return response.json();
  } catch (error) {
    return mockCrops; // Fallback
  }
};
```

### Error Handling
```typescript
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
    router.replace('/login');
  } else {
    setError('Failed to load data');
  }
}
```

---

## Performance Tips

1. **Use FlatList** for long lists instead of ScrollView
2. **Memoize components** that don't change often
3. **Lazy load images** with Image component
4. **Debounce search** inputs
5. **Cache API responses** in AsyncStorage

---

## Resources

- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [React Navigation Docs](https://reactnavigation.org/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [Lucide Icons](https://lucide.dev/)

---

## Support

For questions or issues:
1. Check the NAVIGATION_ANALYSIS.md for architecture details
2. Review NAVIGATION_CODE_EXAMPLES.md for code patterns
3. Check existing screen implementations for reference
4. Refer to the validation utilities for form handling

---

**Last Updated**: 2025-10-18
**Status**: Ready for Phase 3 Implementation

