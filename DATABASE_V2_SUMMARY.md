# Database V2 Schema - Complete Summary

## 🎯 Overview

The V2 schema introduces **dedicated buyer/farmer tables** with clear naming conventions for better organization and separation of concerns.

---

## 📊 Database Tables

### Buyer Tables
| Table Name | Purpose | Key Columns |
|------------|---------|-------------|
| `buyer_cart_items` | Shopping cart | buyer_id, farmer_offer_id, quantity |
| `buyer_wishlist` | Saved crops/offers | buyer_id, crop_id, farmer_offer_id |
| `buyer_purchase_requests` | Crop purchase requests | buyer_id, crop_type, quantity, target_price |
| `buyer_saved_farmers` | Favorite farmers | buyer_id, farmer_id |

### Farmer Tables
| Table Name | Purpose | Key Columns |
|------------|---------|-------------|
| `farmer_crops` | Crop inventory | farmer_id, crop_type, quantity, status |
| `farmer_offers` | Crop offers for sale | farmer_id, crop_id, price, quantity |
| `farmer_request_responses` | Responses to buyer requests | farmer_id, request_id, offered_price |
| `farmer_saved_buyers` | Favorite buyers | farmer_id, buyer_id |

### Shared Tables
| Table Name | Purpose | Used By |
|------------|---------|---------|
| `messages` | Direct messaging | Both |
| `notifications` | User notifications | Both |
| `orders` | Purchase orders | Both |
| `reviews` | User reviews | Both |
| `transport_requests` | Delivery logistics | Both |
| `weather_data` | Weather information | Both |
| `market_prices` | Market pricing data | Both |

---

## 🛠️ Service Files

### Created Services
| Service File | Table(s) Used | Purpose |
|--------------|---------------|---------|
| `services/cart-service.ts` | `buyer_cart_items` | Shopping cart operations |
| `services/wishlist-service.ts` | `buyer_wishlist` | Wishlist/favorites |
| `services/purchase-request-service.ts` | `buyer_purchase_requests` | Buyer crop requests |
| `services/request-response-service.ts` | `farmer_request_responses` | Farmer responses |
| `services/saved-users-service.ts` | `buyer_saved_farmers`, `farmer_saved_buyers` | Save favorite users |
| `services/message-service.ts` | `messages` | Direct messaging |
| `services/notification-service.ts` | `notifications` | User notifications |

### Service Methods

#### Cart Service
```typescript
- addToCart(buyerId, offerId, quantity)
- removeFromCart(buyerId, offerId)
- updateQuantity(buyerId, offerId, quantity)
- getCart(buyerId)
- clearCart(buyerId)
```

#### Wishlist Service
```typescript
- addToWishlist(buyerId, cropId)
- removeFromWishlist(buyerId, cropId)
- isInWishlist(buyerId, cropId)
- getWishlist(buyerId)
- toggleWishlist(buyerId, cropId)
```

#### Purchase Request Service
```typescript
- createRequest(request)
- getBuyerRequests(buyerId)
- getOpenRequests(filters)
- updateStatus(requestId, status)
- deleteRequest(requestId, buyerId)
```

#### Request Response Service
```typescript
- createResponse(response)
- getResponsesForRequest(requestId)
- getFarmerResponses(farmerId)
- updateStatus(responseId, status)
- deleteResponse(responseId, farmerId)
```

#### Saved Users Service
```typescript
- saveFarmer(buyerId, farmerId)
- unsaveFarmer(buyerId, farmerId)
- getSavedFarmers(buyerId)
- isFarmerSaved(buyerId, farmerId)
- toggleSavedFarmer(buyerId, farmerId)
- saveBuyer(farmerId, buyerId)
- unsaveBuyer(farmerId, buyerId)
- getSavedBuyers(farmerId)
- isBuyerSaved(farmerId, buyerId)
- toggleSavedBuyer(farmerId, buyerId)
```

#### Message Service
```typescript
- sendMessage(senderId, receiverId, content)
- getConversation(userId1, userId2)
- getConversations(userId)
- markAsRead(userId, senderId)
```

#### Notification Service
```typescript
- createNotification(userId, title, message, type, relatedId)
- getNotifications(userId, unreadOnly)
- getUnreadCount(userId)
- markAsRead(notificationId)
- markAllAsRead(userId)
- deleteNotification(notificationId, userId)
```

---

## 🚀 Migration Scripts

### Available Commands
```bash
# Show migration summary and instructions
npm run migrate:v2

# Apply schema automatically (tries psql, then shows manual instructions)
npm run apply:schema
```

### Migration Files
- `scripts/supabase-schema-v2.sql` - Complete V2 schema
- `scripts/migrate-to-v2.js` - Migration preparation script
- `scripts/apply-schema-automated.js` - Automated application script
- `scripts/README-SCHEMA-MIGRATION.md` - Detailed migration guide

---

## 📝 Schema Application Methods

### Method 1: Automated (psql)
```bash
# Set database password in .env
SUPABASE_DB_PASSWORD=your-password

# Run automated script
npm run apply:schema
```

### Method 2: Manual (Supabase Dashboard)
1. Open Supabase Dashboard → SQL Editor
2. Copy `scripts/supabase-schema-v2.sql`
3. Paste and run in SQL Editor
4. Verify tables in Table Editor

---

## ✅ What's Fixed

| Issue | Status | Solution |
|-------|--------|----------|
| Policy conflicts | ✅ Fixed | Added `DROP POLICY IF EXISTS` |
| Missing cart service | ✅ Created | `services/cart-service.ts` |
| Missing request services | ✅ Created | Purchase request & response services |
| Missing saved users service | ✅ Created | `services/saved-users-service.ts` |
| Missing message service | ✅ Created | `services/message-service.ts` |
| Missing notification service | ✅ Created | `services/notification-service.ts` |
| Wishlist using old table | ✅ Updated | Now uses `buyer_wishlist` |
| Manual migration process | ✅ Automated | Created migration scripts |

---

## 🧪 Testing Services

```typescript
import { cartService } from '@/services/cart-service';
import { wishlistService } from '@/services/wishlist-service';
import { messageService } from '@/services/message-service';
import { notificationService } from '@/services/notification-service';

// Test cart
await cartService.addToCart(buyerId, offerId, 5);
const cart = await cartService.getCart(buyerId);

// Test wishlist
await wishlistService.toggleWishlist(buyerId, cropId);
const wishlist = await wishlistService.getWishlist(buyerId);

// Test messages
await messageService.sendMessage(senderId, receiverId, "Hello!");
const conversations = await messageService.getConversations(userId);

// Test notifications
await notificationService.createNotification(userId, "New Order", "Your order has been placed", "order");
const notifications = await notificationService.getNotifications(userId);
```

---

## 📋 Next Steps

1. ✅ Apply schema using one of the methods above
2. ⏳ Update screens to use real data from services
3. ⏳ Replace hardcoded mock data with database queries
4. ⏳ Test all CRUD operations
5. ⏳ Migrate existing data if needed

