# Complete Screen Inventory

## Authentication & Onboarding (4 screens)

### 1. `/login` - Login Screen
- **File**: `app/login.tsx`
- **Purpose**: User authentication with mobile number and OTP
- **Features**:
  - Mobile number input
  - OTP verification
  - Resend OTP option
  - Create account link
- **Navigation To**:
  - `/select-role` (after OTP verification)
  - `/farmer-registration` (create account)
- **Navigation From**: `/index`

### 2. `/select-role` - Role Selection
- **File**: `app/select-role.tsx`
- **Purpose**: User selects between Farmer or Buyer role
- **Features**:
  - Role selection (Farmer/Buyer)
  - Language selection (English, Hindi, Telugu, Tamil, Kannada)
  - Continue button
- **Navigation To**:
  - `/farmer-registration` (if Farmer selected)
  - `/buyer-profile-setup` (if Buyer selected)
- **Navigation From**: `/login`

### 3. `/farmer-registration` - Farmer Registration
- **File**: `app/farmer-registration.tsx`
- **Purpose**: Multi-step farmer account creation
- **Steps**:
  1. Enter full name, mobile number
  2. Verify OTP
  3. Setup profile (farm name, size, profile image)
- **Navigation To**: `/farmer-home` (after completion)
- **Navigation From**: `/select-role`

### 4. `/buyer-profile-setup` - Buyer Profile Setup
- **File**: `app/buyer-profile-setup.tsx`
- **Purpose**: Buyer account profile configuration
- **Features**: Profile information, preferences
- **Navigation To**: `/buyer-home` (after completion)
- **Navigation From**: `/select-role`

---

## Farmer-Specific Screens (8 screens)

### 5. `/farmer-home` - Farmer Dashboard
- **File**: `app/farmer-home.tsx`
- **Purpose**: Main farmer dashboard with overview
- **Features**:
  - Profile card with stats (listings, orders, success rate, earnings)
  - Weather widget
  - Search bar
  - Market prices carousel
  - Quick actions (Weather, Market, Add Offer, Nearby Buyers)
  - Add new crop button
  - Recommended buyers list
  - Bottom navigation (Home, My Farms, Voice, Messages, Profile)
- **Navigation To**: `/farmer-weather`, `/market-prices`, `/add-offer`, `/nearby-buyers`, `/my-farms`, `/voice-ai`, `/messages`, `/profile`
- **Navigation From**: `/farmer-registration`

### 6. `/my-farms` - My Farms List
- **File**: `app/my-farms.tsx`
- **Purpose**: Display all farmer's farms with details
- **Features**:
  - Farm list with images, location, size
  - Crop information per farm
  - Farm statistics (active crops, irrigation, sunlight, season)
  - Status indicators (Harvesting, Growing, Planting)
  - Yield and harvest information
- **Navigation To**: `/crop-details`, `/add-crop`
- **Navigation From**: `/farmer-home`

### 7. `/add-crop` - Add New Crop
- **File**: `app/add-crop.tsx`
- **Purpose**: Create new crop listing
- **Features**:
  - Crop type selection
  - Quantity input
  - Price per unit
  - Availability dates
  - Additional notes
- **Navigation To**: `/farmer-home`
- **Navigation From**: `/farmer-home`, `/my-farms`

### 8. `/edit-crop` - Edit Crop
- **File**: `app/edit-crop.tsx`
- **Purpose**: Modify existing crop details
- **Features**: Same as add-crop but with pre-filled data
- **Navigation To**: `/farmer-home`
- **Navigation From**: `/crop-details`

### 9. `/crop-details` - Crop Details
- **File**: `app/crop-details.tsx`
- **Purpose**: View detailed crop information
- **Features**:
  - Crop image and description
  - Price and quantity
  - Farmer information
  - Buyer inquiries
  - Edit/Delete options
- **Navigation To**: `/edit-crop`, `/messages`
- **Navigation From**: `/my-farms`

### 10. `/add-offer` - Create Offer
- **File**: `app/add-offer.tsx`
- **Purpose**: Create crop offer for buyers
- **Features**:
  - Crop type selection
  - Quantity and price
  - Minimum order quantity
  - Availability dates
  - Additional notes
- **Navigation To**: `/farmer-home`
- **Navigation From**: `/farmer-home`

### 11. `/farmer-offers` - View Offers
- **File**: `app/farmer-offers.tsx`
- **Purpose**: View all created offers
- **Features**: List of active offers with status
- **Navigation To**: `/crop-details`
- **Navigation From**: `/farmer-home`

### 12. `/farmer-weather` - Weather Information
- **File**: `app/farmer-weather.tsx`
- **Purpose**: Display weather data for farming
- **Features**:
  - Current weather
  - Temperature, humidity, wind
  - Weather forecast
  - Agricultural recommendations
- **Navigation To**: `/farmer-home`
- **Navigation From**: `/farmer-home` (Quick Action)

---

## Buyer-Specific Screens (4 screens)

### 13. `/buyer-home` - Buyer Dashboard
- **File**: `app/buyer-home.tsx`
- **Purpose**: Main buyer dashboard
- **Features**:
  - Welcome message
  - Search bar
  - Tabs: Nearby Crops, Nearby Farmers
  - Map preview with farmer locations
  - Featured crops grid
  - Quick actions (View Offers, Transport, New Arrivals, Track Order, My Offer)
  - Market real prices
  - Bottom navigation (Home, Crops, Voice, Orders, Profile)
- **Navigation To**: `/nearby-crops`, `/nearby-farmers`, `/offers`, `/transport`, `/new-arrivals`, `/track-order`, `/voice-ai`, `/my-orders`, `/profile`
- **Navigation From**: `/buyer-profile-setup`

### 14. `/nearby-crops` - Nearby Crops
- **File**: `app/nearby-crops.tsx`
- **Purpose**: Browse available crops from nearby farmers
- **Features**:
  - Crop list with images
  - Farmer information
  - Price and availability
  - Add to cart button
  - Filter options
- **Navigation To**: `/crop-details`, `/cart`
- **Navigation From**: `/buyer-home`

### 15. `/nearby-farmers` - Nearby Farmers
- **File**: `app/nearby-farmers.tsx`
- **Purpose**: Find and browse nearby farmers
- **Features**:
  - Farmer list with location
  - Distance information
  - Rating and reviews
  - Contact options
- **Navigation To**: `/farmer-details`, `/nearby-crops`
- **Navigation From**: `/buyer-home`

### 16. `/nearby-farms` - Nearby Farms
- **File**: `app/nearby-farms.tsx`
- **Purpose**: Browse nearby farm locations
- **Features**:
  - Farm map view
  - Farm details
  - Available crops
- **Navigation To**: `/crop-details`
- **Navigation From**: `/buyer-home`

---

## Market & Pricing Screens (3 screens)

### 17. `/market-prices` - Market Prices
- **File**: `app/market-prices.tsx`
- **Purpose**: View market price information
- **Features**:
  - Price list by crop type
  - Historical price trends
  - Price comparisons
- **Navigation To**: `/crop-details`
- **Navigation From**: `/farmer-home` (Quick Action)

### 18. `/market-real-prices` - Real-Time Market Prices
- **File**: `app/market-real-prices.tsx`
- **Purpose**: Real-time market pricing
- **Features**:
  - Live price updates
  - Price changes
  - Market trends
- **Navigation To**: `/market-prices`
- **Navigation From**: `/buyer-home`

### 19. `/new-arrivals` - New Crop Arrivals
- **File**: `app/new-arrivals.tsx`
- **Purpose**: Display newly listed crops
- **Features**:
  - New crop listings
  - Add to cart
  - Bottom navigation
- **Navigation To**: `/cart`
- **Navigation From**: `/buyer-home` (Quick Action)

---

## Order & Cart Screens (4 screens)

### 20. `/cart` - Shopping Cart
- **File**: `app/cart.tsx`
- **Purpose**: Review items before checkout
- **Features**:
  - Cart items list
  - Quantity adjustment
  - Price calculation
  - Proceed to checkout
- **Navigation To**: `/checkout`
- **Navigation From**: `/nearby-crops`, `/new-arrivals`

### 21. `/checkout` - Checkout
- **File**: `app/checkout.tsx`
- **Purpose**: Complete purchase process
- **Features**:
  - Delivery address
  - Payment method
  - Order summary
  - Place order button
- **Navigation To**: `/order-confirmation`
- **Navigation From**: `/cart`

### 22. `/order-confirmation` - Order Confirmation
- **File**: `app/order-confirmation.tsx`
- **Purpose**: Confirm successful order
- **Features**:
  - Order details
  - Confirmation number
  - Estimated delivery
  - Track order button
- **Navigation To**: `/track-order`
- **Navigation From**: `/checkout`

### 23. `/my-orders` - My Orders
- **File**: `app/my-orders.tsx`
- **Purpose**: View all user orders
- **Features**:
  - Order list
  - Order status
  - Track order option
- **Navigation To**: `/track-order`, `/order-confirmation`
- **Navigation From**: `/buyer-home` (Bottom Nav)

---

## Transport Screens (3 screens)

### 24. `/transport` - Transport Options
- **File**: `app/transport.tsx`
- **Purpose**: Arrange transportation
- **Features**:
  - Transport options
  - Pricing
  - Availability
  - Book transport
- **Navigation To**: `/transport-details`
- **Navigation From**: `/buyer-home` (Quick Action)

### 25. `/transport-details` - Transport Details
- **File**: `app/transport-details.tsx`
- **Purpose**: View transport information
- **Features**:
  - Driver details
  - Vehicle information
  - Route and timing
  - Contact driver
- **Navigation To**: `/contact-driver`
- **Navigation From**: `/transport`, `/track-order`

### 26. `/transport-confirmation` - Transport Confirmation
- **File**: `app/transport-confirmation.tsx`
- **Purpose**: Confirm transport booking
- **Features**:
  - Booking confirmation
  - Transport details
  - Tracking information
- **Navigation To**: `/track-order`
- **Navigation From**: `/transport-details`

---

## Communication Screens (3 screens)

### 27. `/messages` - Messages
- **File**: `app/messages.tsx`
- **Purpose**: View message list
- **Features**:
  - Conversation list
  - Unread indicators
  - Last message preview
- **Navigation To**: `/chat-screen`
- **Navigation From**: `/farmer-home`, `/buyer-home` (Bottom Nav)

### 28. `/chat-screen` - Chat Interface
- **File**: `app/chat-screen.tsx`
- **Purpose**: Send/receive messages
- **Features**:
  - Message history
  - Message input
  - Send button
  - User information
- **Navigation To**: `/messages`
- **Navigation From**: `/messages`, `/crop-details`

### 29. `/contact-driver` - Contact Driver
- **File**: `app/contact-driver.tsx`
- **Purpose**: Message transport driver
- **Features**:
  - Driver information
  - Chat interface
  - Call option
- **Navigation To**: `/chat-screen`
- **Navigation From**: `/transport-details`

---

## User Management Screens (3 screens)

### 30. `/profile` - User Profile
- **File**: `app/profile.tsx`
- **Purpose**: View/edit user profile
- **Features**:
  - Profile information
  - Avatar
  - Edit profile
  - Settings link
- **Navigation To**: `/settings`, `/farmer-details`
- **Navigation From**: `/farmer-home`, `/buyer-home` (Bottom Nav)

### 31. `/settings` - App Settings
- **File**: `app/settings.tsx`
- **Purpose**: App configuration
- **Features**:
  - Language settings
  - Notification preferences
  - Privacy settings
  - Logout
- **Navigation To**: `/login`
- **Navigation From**: `/profile`

### 32. `/farmer-details` - Farmer Details
- **File**: `app/farmer-details.tsx`
- **Purpose**: View farmer profile (for buyers)
- **Features**:
  - Farmer information
  - Farm details
  - Crops offered
  - Contact information
- **Navigation To**: `/nearby-crops`, `/chat-screen`
- **Navigation From**: `/nearby-farmers`, `/crop-details`

---

## Additional Screens (5 screens)

### 33. `/notifications` - Notifications
- **File**: `app/notifications.tsx`
- **Purpose**: View all notifications
- **Features**:
  - Notification list
  - Mark as read
  - Delete notifications
- **Navigation To**: [Relevant screens based on notification type]
- **Navigation From**: [Any screen with notification bell]

### 34. `/voice-ai` - Voice AI Assistant
- **File**: `app/voice-ai.tsx`
- **Purpose**: Voice command interface
- **Features**:
  - Voice input
  - Recent queries
  - Search results
- **Navigation To**: [Dynamic based on voice command]
- **Navigation From**: `/farmer-home`, `/buyer-home` (Voice Button)

### 35. `/weather` - Weather Information
- **File**: `app/weather.tsx`
- **Purpose**: Detailed weather information
- **Features**:
  - Weather forecast
  - Temperature trends
  - Agricultural alerts
- **Navigation To**: `/farmer-home`
- **Navigation From**: `/farmer-weather`

### 36. `/soil-test` - Soil Testing
- **File**: `app/soil-test.tsx`
- **Purpose**: Soil testing information
- **Features**:
  - Soil test results
  - Recommendations
  - Testing centers
- **Navigation To**: `/farmer-home`
- **Navigation From**: `/farmer-home`

### 37. `/insights` - Analytics & Insights
- **File**: `app/insights.tsx`
- **Purpose**: Farm analytics and insights
- **Features**:
  - Yield analytics
  - Market trends
  - Performance metrics
- **Navigation To**: `/farmer-home`
- **Navigation From**: `/farmer-home`

### 38. `/wishlist` - Wishlist
- **File**: `app/wishlist.tsx`
- **Purpose**: Saved crops/favorites
- **Features**:
  - Saved crops list
  - Remove from wishlist
  - Add to cart
- **Navigation To**: `/crop-details`, `/cart`
- **Navigation From**: `/buyer-home`

### 39. `/track-order` - Order Tracking
- **File**: `app/track-order.tsx`
- **Purpose**: Track order status and delivery
- **Features**:
  - Order status
  - Delivery tracking
  - Estimated arrival
  - Contact seller/driver
- **Navigation To**: `/transport-details`, `/contact-driver`
- **Navigation From**: `/my-orders`, `/order-confirmation`

### 40. `/offers` - View Offers
- **File**: `app/offers.tsx`
- **Purpose**: Browse available offers
- **Features**:
  - Offer list
  - Offer details
  - Accept offer
- **Navigation To**: `/crop-details`, `/cart`
- **Navigation From**: `/buyer-home` (Quick Action)

---

## Tab & Modal Screens (3 screens)

### 41. `(tabs)/index` - Home Tab
- **File**: `app/(tabs)/index.tsx`
- **Purpose**: Tab-based home screen
- **Features**: Welcome message, tutorial links
- **Navigation To**: `/modal`
- **Navigation From**: Tab navigation

### 42. `(tabs)/explore` - Explore Tab
- **File**: `app/(tabs)/explore.tsx`
- **Purpose**: Tab-based explore screen
- **Features**: App documentation, feature overview
- **Navigation To**: Various documentation links
- **Navigation From**: Tab navigation

### 43. `/modal` - Modal Screen
- **File**: `app/modal.tsx`
- **Purpose**: Example modal presentation
- **Features**: Modal content, dismiss button
- **Navigation To**: `/` (dismiss)
- **Navigation From**: `(tabs)/index`

---

## Utility Screens (4 screens)

### 44. `/index` - Root Home
- **File**: `app/index.tsx`
- **Purpose**: App entry point
- **Features**: Placeholder content
- **Navigation To**: `/login`
- **Navigation From**: App start

### 45. `/bottom-tabs` - Bottom Navigation Component
- **File**: `app/bottom-tabs.tsx`
- **Purpose**: Reusable bottom tab component
- **Features**: 5 tabs (Home, My Farms, Voice, Messages, Profile)
- **Navigation To**: Various screens
- **Navigation From**: Embedded in screens

### 46. `/farmer-profile-setup` - Farmer Profile Setup
- **File**: `app/farmer-profile-setup.tsx`
- **Purpose**: Initial farmer profile configuration
- **Features**: Profile information, farm details
- **Navigation To**: `/farmer-home`
- **Navigation From**: `/farmer-registration`

### 47. `/nearby-buyers` - Nearby Buyers
- **File**: `app/nearby-buyers.tsx`
- **Purpose**: Find nearby buyers
- **Features**: Buyer list, location, contact
- **Navigation To**: `/chat-screen`
- **Navigation From**: `/farmer-home` (Quick Action)

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Authentication & Onboarding | 4 |
| Farmer-Specific | 8 |
| Buyer-Specific | 4 |
| Market & Pricing | 3 |
| Order & Cart | 4 |
| Transport | 3 |
| Communication | 3 |
| User Management | 3 |
| Additional Features | 5 |
| Tab & Modal | 3 |
| Utility | 4 |
| **TOTAL** | **47** |

---

## Navigation Patterns by Screen Type

### Screens with Bottom Navigation
- `/farmer-home`
- `/buyer-home`
- `/my-farms`
- `/nearby-crops`
- `/messages`
- `/profile`

### Screens with Back Button
- All non-tab screens

### Modal Screens
- `/modal`

### Tab Screens
- `(tabs)/index`
- `(tabs)/explore`

