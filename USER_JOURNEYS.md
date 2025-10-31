# User Journey Paths - React Native Expo App

## 1. Farmer User Journey

### Path 1: Complete Farmer Onboarding
```
START
  ↓
/index (Root Home)
  ↓
/login (Enter mobile number)
  ↓
/login (Enter OTP)
  ↓
/select-role (Select "Farmer")
  ↓
/farmer-registration (Step 1: Enter Details)
  ↓
/farmer-registration (Step 2: Verify OTP)
  ↓
/farmer-registration (Step 3: Setup Profile)
  ↓
/farmer-home (Dashboard - MAIN SCREEN)
```

### Path 2: Farmer - Add & Sell Crops
```
/farmer-home (Dashboard)
  ↓
[Click "Add New Crop" button]
  ↓
/add-crop (Create new crop listing)
  ↓
/add-offer (Set price & availability)
  ↓
/farmer-home (Return to dashboard)
  ↓
/my-farms (View all crops)
  ↓
/crop-details (View specific crop)
  ↓
/farmer-offers (View offers from buyers)
```

### Path 3: Farmer - Check Market & Weather
```
/farmer-home (Dashboard)
  ↓
[Quick Actions]
  ├─→ /farmer-weather (Check weather)
  ├─→ /market-prices (View market prices)
  └─→ /nearby-buyers (Find nearby buyers)
  ↓
/farmer-home (Return to dashboard)
```

### Path 4: Farmer - Manage Orders
```
/farmer-home (Dashboard)
  ↓
[Bottom Navigation - Messages]
  ↓
/messages (View buyer inquiries)
  ↓
/chat-screen (Chat with buyer)
  ↓
/my-orders (View orders)
  ↓
/track-order (Track shipment)
  ↓
/transport-details (View transport info)
```

### Path 5: Farmer - Profile Management
```
/farmer-home (Dashboard)
  ↓
[Bottom Navigation - Profile]
  ↓
/profile (View/Edit profile)
  ↓
/settings (App settings)
  ↓
/farmer-details (View farm details)
```

### Path 6: Farmer - Voice AI Assistance
```
/farmer-home (Dashboard)
  ↓
[Bottom Navigation - Voice Button (Center)]
  ↓
/voice-ai (Voice command interface)
  ↓
[Speak command: "Show market price for rice"]
  ↓
/market-prices (Results)
```

---

## 2. Buyer User Journey

### Path 1: Complete Buyer Onboarding
```
START
  ↓
/index (Root Home)
  ↓
/login (Enter mobile number)
  ↓
/login (Enter OTP)
  ↓
/select-role (Select "Buyer")
  ↓
/buyer-profile-setup (Setup profile)
  ↓
/buyer-home (Dashboard - MAIN SCREEN)
```

### Path 2: Buyer - Browse & Purchase Crops
```
/buyer-home (Dashboard)
  ↓
[Tab: "Nearby Crops"]
  ↓
/nearby-crops (Browse available crops)
  ↓
[Click on crop card]
  ↓
/crop-details (View crop details)
  ↓
[Click "Add to Cart"]
  ↓
/cart (Review cart items)
  ↓
[Click "Proceed to Checkout"]
  ↓
/checkout (Enter delivery details)
  ↓
/order-confirmation (Order placed successfully)
```

### Path 3: Buyer - Find Farmers & Crops
```
/buyer-home (Dashboard)
  ↓
[Tab: "Nearby Farmers"]
  ↓
/nearby-farmers (Browse farmers)
  ↓
[Click on farmer]
  ↓
/farmer-details (View farmer profile)
  ↓
/nearby-crops (View farmer's crops)
  ↓
/crop-details (Select crop)
  ↓
/cart (Add to cart)
```

### Path 4: Buyer - Quick Actions
```
/buyer-home (Dashboard)
  ↓
[Quick Actions]
  ├─→ /offers (View available offers)
  ├─→ /transport (Arrange transport)
  ├─→ /new-arrivals (See new crops)
  ├─→ /track-order (Track existing order)
  └─→ /nearby-crops (Browse crops)
```

### Path 5: Buyer - Order Management
```
/buyer-home (Dashboard)
  ↓
[Bottom Navigation - Orders]
  ↓
/my-orders (View all orders)
  ↓
[Click on order]
  ↓
/track-order (Track shipment)
  ↓
/transport-details (View transport info)
  ↓
/contact-driver (Message driver)
```

### Path 6: Buyer - Wishlist & Favorites
```
/buyer-home (Dashboard)
  ↓
/nearby-crops (Browse crops)
  ↓
[Click heart icon on crop]
  ↓
/wishlist (View saved crops)
  ↓
[Click on saved crop]
  ↓
/crop-details (View details)
  ↓
/cart (Add to cart)
```

### Path 7: Buyer - Market Prices & Insights
```
/buyer-home (Dashboard)
  ↓
/market-real-prices (View real-time prices)
  ↓
/market-prices (Historical prices)
  ↓
/insights (Market analytics)
```

---

## 3. Shared User Journeys

### Path 1: Communication
```
[Any Screen]
  ↓
[Bottom Navigation - Messages]
  ↓
/messages (Message list)
  ↓
[Click on conversation]
  ↓
/chat-screen (Chat interface)
  ↓
[Send/receive messages]
```

### Path 2: Notifications
```
[Any Screen]
  ↓
[Click notification bell icon]
  ↓
/notifications (View all notifications)
  ↓
[Click on notification]
  ↓
[Navigate to relevant screen]
```

### Path 3: Profile & Settings
```
[Any Screen]
  ↓
[Bottom Navigation - Profile]
  ↓
/profile (User profile)
  ↓
[Click settings]
  ↓
/settings (App settings)
```

### Path 4: Voice AI Assistance
```
[Any Screen]
  ↓
[Click center Voice button]
  ↓
/voice-ai (Voice interface)
  ↓
[Speak command]
  ↓
[Navigate to result screen]
```

---

## 4. Navigation Triggers & Methods

### Button Press Navigation
```typescript
// Example from farmer-home.tsx
<TouchableOpacity onPress={() => router.push('/add-offer')}>
  <Text>Add Offer</Text>
</TouchableOpacity>
```

### Link Component Navigation
```typescript
// Example from modal.tsx
<Link href="/" dismissTo>
  <Text>Go to home screen</Text>
</Link>
```

### Back Navigation
```typescript
// Example from new-arrivals.tsx
<TouchableOpacity onPress={() => router.back()}>
  <ArrowLeft />
</TouchableOpacity>
```

### Conditional Navigation
```typescript
// Example from farmer-registration.tsx
if (selectedRole === 'farmer') {
  router.push('/farmer-registration');
} else {
  router.push('/buyer-profile-setup');
}
```

---

## 5. Navigation Parameters (Current Implementation)

### Current Status
- **No complex parameters** are currently being passed between screens
- Navigation is primarily **path-based**
- State is managed **locally** within each screen component

### Example: Crop Details
```typescript
// Current approach (no parameters)
router.push('/crop-details');

// Recommended approach (with parameters)
router.push({
  pathname: '/crop-details',
  params: { cropId: 123, farmerId: 456 }
});
```

---

## 6. Modal Navigation

### Modal Screen Access
```
[Any Screen]
  ↓
<Link href="/modal">
  ↓
/modal (Full-screen modal)
  ↓
[Click "Go to home screen"]
  ↓
/ (Dismiss modal, return to home)
```

### Modal Presentation
- **Type**: Full-screen modal
- **Dismissal**: Using `dismissTo` prop
- **Animation**: Default Expo Router animation

---

## 7. Deep Linking Examples

### Configured Scheme
- **Scheme**: `myapp://`

### Example Deep Links
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

### Usage
- External app links
- Push notifications
- Email links
- Web links

---

## 8. Navigation Flow Summary

| User Type | Entry Point | Main Dashboard | Key Features |
|-----------|------------|-----------------|--------------|
| Farmer | /login | /farmer-home | Add crops, View offers, Weather, Market prices |
| Buyer | /login | /buyer-home | Browse crops, Purchase, Track orders |
| Both | /login | Role-specific | Messages, Profile, Voice AI, Notifications |

---

## 9. Recommended Navigation Enhancements

1. **Add Navigation Parameters**
   - Pass crop ID, farmer ID, order ID between screens
   - Enable deep linking with parameters

2. **Implement Navigation State**
   - Track navigation history
   - Handle back button properly
   - Prevent duplicate navigation

3. **Add Loading States**
   - Show loading during navigation
   - Handle navigation errors

4. **Centralize Bottom Navigation**
   - Create reusable bottom nav component
   - Reduce code duplication

5. **Add Route Guards**
   - Protect authenticated routes
   - Redirect unauthenticated users to login

