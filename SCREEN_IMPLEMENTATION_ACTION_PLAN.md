# 📋 Screen Implementation Action Plan

## Overview

This document outlines the work needed to complete all 47 screens in the app.

---

## PHASE 5: Update 13 Partial Screens (Priority 1)

These screens have useRouter but need useAuth and/or bottom navigation.

### Authentication Screens (4) - Note: Auth screens typically don't need bottom nav
- [ ] login.tsx - Add bottom nav (optional for auth flow)
- [ ] select-role.tsx - Add bottom nav (optional for auth flow)
- [ ] farmer-registration.tsx - Add bottom nav (optional for auth flow)
- [ ] buyer-profile-setup.tsx - Add bottom nav (optional for auth flow)

### Market/Pricing (1)
- [ ] offers.tsx - Add useAuth + bottom nav

### Orders/Cart (1)
- [ ] order-confirmation.tsx - Add useAuth + bottom nav

### Communication (2)
- [ ] chat-screen.tsx - Add useAuth + bottom nav
- [ ] contact-driver.tsx - Add useAuth + bottom nav

### Additional Features (3)
- [ ] voice-ai.tsx - Add useAuth + bottom nav
- [ ] weather.tsx - Add useAuth + bottom nav
- [ ] track-order.tsx - Add useAuth + bottom nav

### Other (2)
- [ ] add-offer.tsx - Add useAuth + bottom nav
- [ ] index.tsx - Add bottom nav

**Estimated Time**: 2-3 hours  
**Complexity**: Low (copy-paste pattern from Phase 3/4)

---

## PHASE 6: Implement 22 Remaining Screens (Priority 2)

### Market/Pricing (2)
- [ ] market-prices.tsx - Add useRouter + useAuth + bottom nav
- [ ] market-real-prices.tsx - Add useRouter + useAuth + bottom nav

### Transport (3)
- [ ] transport.tsx - Add useRouter + useAuth + bottom nav
- [ ] transport-details.tsx - Add useRouter + useAuth + bottom nav
- [ ] transport-confirmation.tsx - Add useRouter + useAuth + bottom nav

### Communication (1)
- [ ] messages.tsx - Add useRouter + useAuth + bottom nav

### User Management (1)
- [ ] farmer-details.tsx - Add useRouter + useAuth + bottom nav

### Additional Features (2)
- [ ] soil-test.tsx - Add useRouter + useAuth + bottom nav
- [ ] wishlist.tsx - Add useRouter + useAuth + bottom nav

### Utility (5)
- [ ] notifications.tsx - Add useRouter + useAuth + bottom nav
- [ ] nearby-crops.tsx - Add useRouter + useAuth + bottom nav
- [ ] nearby-farmers.tsx - Add useRouter + useAuth + bottom nav
- [ ] nearby-farms.tsx - Add useRouter + useAuth + bottom nav
- [ ] nearby-buyers.tsx - Add useRouter + useAuth + bottom nav

### Other (4)
- [ ] add-edit-crop.tsx - Add useRouter + useAuth + bottom nav
- [ ] edit-crop.tsx - Add useRouter + useAuth + bottom nav
- [ ] farmer-profile-setup.tsx - Add useRouter + useAuth + bottom nav
- [ ] (tabs)/index.tsx - Add useRouter + useAuth + bottom nav
- [ ] (tabs)/explore.tsx - Add useRouter + useAuth + bottom nav
- [ ] modal.tsx - Add useRouter + useAuth
- [ ] bottom-tabs.tsx - Add useRouter + useAuth

**Estimated Time**: 4-5 hours  
**Complexity**: Medium (need to add navigation logic)

---

## PHASE 7: Comprehensive Testing (Priority 3)

### Test Coverage
- [ ] Test all 47 screens for navigation
- [ ] Test all 47 screens for auth integration
- [ ] Test all bottom navigation on all screens
- [ ] Test deep linking
- [ ] Test logout flow
- [ ] Test error handling

**Estimated Time**: 3-4 hours  
**Complexity**: Medium

---

## PHASE 8: Bug Fixes & Optimization (Priority 4)

- [ ] Fix any navigation issues
- [ ] Fix any auth issues
- [ ] Optimize performance
- [ ] Fix styling inconsistencies
- [ ] Add missing error handling

**Estimated Time**: 2-3 hours  
**Complexity**: Medium

---

## Implementation Pattern

For each screen that needs updates, follow this pattern:

```typescript
// 1. Add imports
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import {
  Home,
  Sprout,
  Mic,
  MessageCircle,
  User,
  // ... other icons
} from 'lucide-react-native';

// 2. Add hooks in component
const router = useRouter();
const { user } = useAuth();

// 3. Add bottom navigation at end of JSX
<View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
  <View className="flex-row items-center justify-between px-3 pb-6 pt-2">
    {/* Home Tab */}
    <TouchableOpacity onPress={() => router.push("/buyer-home")}>
      <Home size={24} color="#6b7280" strokeWidth={2} />
      <Text className="text-xs text-gray-500 mt-1">Home</Text>
    </TouchableOpacity>
    {/* ... other tabs ... */}
  </View>
  <View className="h-[12px] bg-white" />
</View>

// 4. Add pb-24 to main content to prevent overlap
<ScrollView className="flex-1 pb-24">
  {/* content */}
</ScrollView>
```

---

## Priority Order

1. **PHASE 5** (13 screens) - Quick wins, low effort
2. **PHASE 6** (22 screens) - Main implementation
3. **PHASE 7** (Testing) - Verify everything works
4. **PHASE 8** (Optimization) - Polish and fix

---

## Estimated Total Time

- Phase 5: 2-3 hours
- Phase 6: 4-5 hours
- Phase 7: 3-4 hours
- Phase 8: 2-3 hours

**Total**: 11-15 hours

---

## Current Status

- ✅ Phase 3 Complete (8 screens)
- ✅ Phase 4 Complete (4 screens)
- ⏳ Phase 5 Pending (13 screens)
- ⏳ Phase 6 Pending (22 screens)
- ⏳ Phase 7 Pending (Testing)
- ⏳ Phase 8 Pending (Optimization)

---

## Testing Readiness

**Current**: 25.5% (12/47 screens ready)  
**After Phase 5**: 52% (37/47 screens ready)  
**After Phase 6**: 100% (47/47 screens ready)

---

## Recommendation

1. **Start with Phase 5** - Quick updates to 13 partial screens
2. **Then Phase 6** - Implement remaining 22 screens
3. **Then Phase 7** - Comprehensive testing
4. **Then Phase 8** - Final optimization

This approach ensures you have working screens at each phase for testing.

---

**Last Updated**: 2025-10-18  
**Status**: Ready for Phase 5 implementation

