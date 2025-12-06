# Real Data Implementation Fix Plan

## Overview
This document outlines the comprehensive fixes needed to replace all mock data with real-time data from the backend.

## 1. Market Prices (Farmer + Buyer) ✅

### Image Mismatch Issues
**Status**: Already Fixed in `services/market-prices-service.ts`

The following crops already have correct image mappings:
- ✅ lemon → `assets/images/crops/lemon.jpg`
- ✅ sweet lime → `assets/images/crops/sweet_lime.jpg`
- ✅ wood → `assets/images/crops/wood.jpg`
- ✅ peas → `assets/images/crops/peas.jpg`
- ✅ coriander leaves → `assets/images/crops/coriander_leaves.jpg`
- ✅ guava → `assets/images/crops/guava.jpg`
- ✅ green chilli → `assets/images/crops/green_chilli.jpg`
- ✅ paddy → `assets/images/crops/paddy.jpg`
- ✅ wheat → `assets/images/crops/wheat.jpg`
- ✅ soyabean → `assets/images/crops/soyabean.jpg`
- ✅ tur dal → `assets/images/crops/tur_dal.jpg`
- ⚠️ green banana → Using pineapple as fallback (need dedicated image)
- ✅ colocasia → `assets/images/crops/colacassia.jpg`
- ⚠️ jaggery → Using turmeric as fallback (need dedicated image)
- ⚠️ garlic → Using ginger as fallback (need dedicated image)
- ⚠️ papaya → Using guava as fallback (need dedicated image)

### Navigation Fix
**Issue**: Market Prices button opens wrong screen
**Fix Needed**:
- Farmer Home: "Market Prices" → `/market-prices` (real data)
- Buyer Home: "Market Prices" → `/buyer-market-prices` (real data)

## 2. Farmer Home Dashboard Fixes

### My Farms Section
**Current Status**: Partially implemented
**Issues**:
- ✅ Fetches real data from `farmer_crops` table
- ❌ "Farm Details" button still exists (needs removal)
- ❌ Crop card not clickable
- ❌ Not showing farm name, location properly

**Fixes Needed**:
1. Remove "Farm Details" button
2. Make entire crop card clickable → navigate to `/crop-details`
3. Display: farm name, location, crop, quantity, status
4. Auto-fetch logged-in user's farms

### Recommended Buyers Section
**Current Status**: Using mock nearby buyers
**Issues**:
- ❌ Shows generic nearby buyers, not "saved" or "recently contacted"
- ❌ Mock data from map service

**Fixes Needed**:
1. Create new query to fetch:
   - Buyers who messaged this farmer
   - Buyers who viewed farmer's crops
   - Recently connected buyers
2. Show last 3-5 buyers
3. Display real buyer info from database

## 3. Farmer Profile → Saved Buyers

**Current Status**: Not implemented
**Fixes Needed**:
1. Create `saved_buyers` table or use existing relationships
2. Fetch real saved buyers for logged-in farmer
3. Display buyer cards with:
   - Name, avatar, location, distance
   - Last contacted date
   - Quick actions (chat, call, view profile)

## 4. Buyer Home → Nearby Crops Screen

### Messaging Issue
**Current Status**: Partially working
**Issues**:
- ❌ Messages may not send successfully
- ❌ Not appearing instantly in both chats
- ❌ Real-time sync issues

**Fixes Needed**:
1. Fix `sendMessage` API in `chat-service.ts`
2. Ensure real-time subscription works both ways
3. Test message delivery and instant display

### Photo Upload
**Current Status**: Not implemented
**Issues**:
- ❌ Left-side media icon doesn't open gallery
- ❌ No photo upload functionality

**Fixes Needed**:
1. Add `expo-image-picker` functionality
2. Upload to Supabase storage
3. Display in chat with proper formatting

### Voice/Video Call Issues
**Current Status**: Agora integration exists but has errors
**Issues**:
- ❌ "Failed to start call" error
- ❌ Phone icon shows even when no phone number

**Fixes Needed**:
1. Fix Agora call initialization
2. Hide phone icon if `farmer.phone` is null/empty
3. Proper error handling for call failures

### Crop Details
**Current Status**: Filter icon exists, crops not clickable
**Fixes Needed**:
1. Remove filter icon from top right
2. Make each crop item clickable
3. Navigate to `/buyer-crop-details` with crop ID

## 5. Chat System (Buyer ↔ Farmer)

**Current Status**: Basic implementation exists
**Issues**:
- ❌ Photo upload not working in farmer chat
- ❌ Message send may fail
- ❌ Real-time sync issues
- ❌ Mock messages may still exist

**Fixes Needed**:
1. Implement photo upload in both chat screens
2. Fix message sending API
3. Ensure real-time subscription works
4. Remove any mock chat data
5. Test bidirectional messaging

## Implementation Priority

### Phase 1: Critical Fixes (High Priority)
1. ✅ Market prices image mapping (already done)
2. 🔄 Navigation fixes (market prices buttons)
3. 🔄 Farmer Home - My Farms section fixes
4. 🔄 Chat message sending fixes

### Phase 2: Feature Completion (Medium Priority)
5. 🔄 Recommended Buyers real data
6. 🔄 Saved Buyers implementation
7. 🔄 Photo upload in chat
8. 🔄 Crop details clickable navigation

### Phase 3: Polish (Lower Priority)
9. 🔄 Voice/video call fixes
10. 🔄 Filter icon removal
11. 🔄 UI/UX improvements

## Files to Modify

### Services
- ✅ `services/market-prices-service.ts` - Already fixed
- 🔄 `services/chat-service.ts` - Fix message sending
- 🔄 `services/farmer-service.ts` - Add recommended buyers query
- 🔄 `services/crop-service.ts` - Ensure real data only

### Screens
- 🔄 `app/farmer-home.tsx` - Fix My Farms, Recommended Buyers
- 🔄 `app/buyer-home.tsx` - Fix navigation
- 🔄 `app/nearby-crops.tsx` - Fix clickable crops, remove filter
- 🔄 `app/chat-screen.tsx` - Fix photo upload, messaging
- 🔄 `app/buyer-chat-screen.tsx` - Fix photo upload, messaging
- 🔄 `app/saved-buyers.tsx` - Implement real data
- 🔄 `app/my-farms.tsx` - Fix crop card navigation

### Database
- 🔄 May need new tables/queries for:
  - Saved buyers
  - Recent interactions
  - Chat media storage

## Testing Checklist

- [ ] Market prices show correct images for all crops
- [ ] Market prices button navigates to correct screen
- [ ] Farmer Home shows real user farms
- [ ] Crop cards are clickable and navigate correctly
- [ ] Recommended buyers show real recent contacts
- [ ] Saved buyers page shows real saved data
- [ ] Chat messages send successfully
- [ ] Chat messages appear instantly in both screens
- [ ] Photo upload works in chat
- [ ] Voice/video calls initialize properly
- [ ] Phone icon hidden when no phone number
- [ ] Crop items clickable in nearby crops
- [ ] Filter icon removed from nearby crops
- [ ] No mock data anywhere in the app

## Notes
- All changes must maintain existing UI/UX design
- Ensure backward compatibility
- Test on both Android and iOS
- Verify real-time subscriptions work correctly
