# 🔧 Comprehensive Fixes Plan - Plot My Farm

## Issues to Fix (Prioritized)

### 🔴 CRITICAL - Authentication & Navigation
1. **Buyer role navigation** - Redirects to farmer home instead of buyer home
2. **Registration failed** - Some phone numbers fail, data not stored in Supabase

### 🟠 HIGH PRIORITY - Back Button Navigation
3. **Notifications page** - Back button not working
4. **Nearby Buyers page** - Back button not working  
5. **All pages** - Inconsistent back button behavior

### 🟡 MEDIUM PRIORITY - Action Buttons
6. **Call & Message actions** - Not working across all pages
7. **Edit & Delete actions** - Not working in My Offers
8. **Farmers' Ideas actions** - Not working

### 🟢 LOW PRIORITY - UI/UX
9. **Gap between maps and market prices** - Layout issue
10. **Field alignment** - Not proper
11. **Vegetable images** - Some incorrect

### 🔵 FEATURE COMPLETION - Settings Page
12. **Profile update** - Shows "coming soon"
13. **Language change** - Not working
14. **Terms & Conditions** - Button not working
15. **About App** - Button not working

### 🟣 FEATURE COMPLETION - My Fields
16. **Mic button** - Not working
17. **Filter button** - Not working
18. **Field images** - Not showing at bottom
19. **Three-dot menu** - Not working
20. **Image upload** - Not working
21. **Calendar button** - Not working
22. **Crop save** - Data not being saved

### ⚫ FEATURE COMPLETION - Doubts Page
23. **Message send** - Not working
24. **File upload** - Not working
25. **Call & Video call** - Not working

---

## Fix Strategy

### Phase 1: Critical Fixes (30 min)
- Fix buyer navigation logic in auth-context.tsx and login.tsx
- Fix Supabase registration to handle all phone numbers
- Add proper error handling and logging

### Phase 2: Navigation Fixes (20 min)
- Add router.back() to all back buttons
- Ensure router is imported in all pages
- Test navigation flow

### Phase 3: Action Buttons (30 min)
- Implement Call functionality (Linking.openURL)
- Implement Message functionality (navigate to chat)
- Implement Edit/Delete with state management

### Phase 4: UI/UX Fixes (15 min)
- Fix gaps and alignment
- Update vegetable images
- Improve layout consistency

### Phase 5: Feature Completion (45 min)
- Implement Settings functionality
- Implement My Fields functionality
- Create Doubts/Farmers Ideas page

### Phase 6: Build APK (15 min)
- Test all fixes
- Build production APK
- Verify on device

---

## Files to Modify

### Authentication & Navigation
- `contexts/auth-context.tsx` - Fix buyer role handling
- `app/login.tsx` - Fix navigation logic
- `app/buyer-profile-setup.tsx` - Ensure proper registration

### Back Button Fixes
- `app/notifications.tsx` - Add router import
- `app/nearby-buyers.tsx` - Add router.back()
- `app/settings.tsx` - Verify router.back()

### Action Buttons
- `app/farmer-offers.tsx` - Implement edit/delete
- `app/nearby-farmers.tsx` - Implement call/message
- `app/nearby-buyers.tsx` - Implement call/message
- `app/crop-details.tsx` - Implement call/message

### UI/UX
- `app/buyer-home.tsx` - Fix gaps
- `app/farmer-home.tsx` - Fix alignment
- Update crop images in mock data

### Settings
- `app/settings.tsx` - Implement all functionality
- Create `app/terms.tsx`
- Create `app/about.tsx`

### My Fields
- `app/my-farms.tsx` - Implement all actions
- `app/add-crop.tsx` - Fix image upload
- `app/edit-crop.tsx` - Fix save functionality

### Doubts Page
- Create `app/farmers-ideas.tsx` or `app/doubts.tsx`
- Implement messaging
- Implement file upload
- Implement call/video call

---

## Testing Checklist

### Authentication
- [ ] Buyer role selection → Login → Buyer home (not farmer home)
- [ ] Farmer role selection → Login → Farmer home
- [ ] Registration saves to Supabase
- [ ] All phone numbers work

### Navigation
- [ ] All back buttons work
- [ ] No navigation errors in console
- [ ] Proper screen transitions

### Actions
- [ ] Call buttons open phone dialer
- [ ] Message buttons navigate to chat
- [ ] Edit/Delete work properly

### UI/UX
- [ ] No gaps or misalignments
- [ ] All images load correctly
- [ ] Consistent styling

### Features
- [ ] Settings all functional
- [ ] My Fields all functional
- [ ] Doubts page functional

---

## Next Steps

1. Start with Phase 1 (Critical Fixes)
2. Test after each phase
3. Document changes
4. Build APK after all fixes
5. Test on real device


