# Comprehensive Implementation Guide: Voice Input & Critical Fixes

## Overview
This document outlines all requested changes and provides implementation guidance.

---

## ✅ COMPLETED: Reusable Voice Input Hook

**File Created:** `hooks/useVoiceInput.ts`

This hook provides inline voice recognition without navigation. Usage:

```typescript
const { isRecording, toggleRecording } = useVoiceInput({
  onTranscript: (text) => setSearchText(text),
  language: 'en'
});

// In component:
<TouchableOpacity onPress={toggleRecording}>
  <Mic 
    color={isRecording ? '#EF4444' : '#9CA3AF'}
    fill={isRecording ? '#EF4444' : 'none'}
  />
</TouchableOpacity>
```

---

## 🔧 IMPLEMENTATION REQUIRED

### 1. Voice Input - Inline Recognition (No Navigation)

#### A. Select Role Page (`app/select-role.tsx`)
**Current:** Opens voice agent modal
**Required:** Inline voice Q&A

**Implementation:**
```typescript
import { useVoiceInput } from '@/hooks/useVoiceInput';

// In component:
const { isRecording, toggleRecording } = useVoiceInput({
  onTranscript: async (text) => {
    // Process voice command
    if (text.toLowerCase().includes('farmer')) {
      setSelectedRole('farmer');
    } else if (text.toLowerCase().includes('buyer')) {
      setSelectedRole('buyer');
    }
    // Add more voice commands as needed
  }
});

// Replace modal trigger with inline voice
```

#### B. Farmer Home Dashboard (`app/farmer-home.tsx`)
**Location:** Search bar microphone
**Required:** Voice search without navigation

**Implementation:**
```typescript
const { isRecording, toggleRecording } = useVoiceInput({
  onTranscript: (text) => setSearchText(text)
});
```

#### C. My Farms Page (`app/my-farms.tsx`)
**Location:** Search bar microphone
**Required:** Voice search

**Implementation:** Same as Farmer Home

#### D. Nearby Buyers Page (`app/nearby-buyers.tsx`)
**Location:** Search bar microphone  
**Current:** Navigates to /voice-ai
**Required:** Inline voice search

**Implementation:** Same as Farmer Home

---

### 2. UI Fixes

#### A. Farmer Profile Setup (`app/farmer-profile-setup.tsx`)
**Required:** Remove microphone icon from pincode field

**Implementation:**
```typescript
// Find pincode TextInput
// Remove the TouchableOpacity with Mic icon
<TextInput
  // ... existing props
  // NO microphone icon
/>
```

#### B. Nearby Buyers - Glass Card Map (`app/nearby-buyers.tsx`)
**Required:** Glass card design for map view

**Implementation:**
```typescript
<View
  style={{
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)', // Note: May not work on all platforms
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  }}
>
  <MapLibreView ... />
</View>
```

#### C. Nearby Buyers - Bottom Navigation Colors
**Required:** Green & black only (match farmer dashboard)

**Implementation:**
Check `components/BuyerBottomNav.tsx` and ensure colors match `FarmerBottomNav.tsx`:
- Active: #7C8B3A (green)
- Inactive: #000000 (black)

#### D. Nearby Buyers - Remove Video Call Button
**Required:** Remove purple video call icon

**Implementation:**
In `app/nearby-buyers.tsx`, find the action buttons section and remove:
```typescript
<TouchableOpacity
  onPress={() => handleVideo(buyer.name, buyer.id)}
>
  <Video size={16} color="#FFFFFF" />
</TouchableOpacity>
```

---

### 3. Data Persistence Fixes

#### A. Edit Crop - Save to My Farms
**Issue:** Crops save but don't appear in My Farms
**Root Cause:** Likely table name mismatch or missing refresh

**Investigation Required:**
1. Check table name in `app/edit-crop.tsx` (currently `farmer_crops`)
2. Check table name in `app/my-farms.tsx`
3. Ensure both use same table
4. Add refresh after save

**Implementation:**
```typescript
// In edit-crop.tsx after successful save:
router.back(); // This should trigger my-farms to refresh

// In my-farms.tsx, add useFocusEffect:
import { useFocusEffect } from '@react-navigation/native';

useFocusEffect(
  useCallback(() => {
    loadCrops();
  }, [])
);
```

#### B. Add/Edit Offer - Save Functionality
**Issue:** Failing to save offer details

**Investigation Required:**
1. Check console logs for errors
2. Verify Supabase table structure
3. Check RLS policies

**Implementation:**
```typescript
// Add comprehensive error logging
try {
  const { data, error } = await supabase
    .from('farmer_offers')
    .upsert({...});
    
  if (error) {
    console.error('Supabase error:', error);
    Alert.alert('Error', error.message);
  }
} catch (err) {
  console.error('Catch error:', err);
}
```

#### C. Add/Edit Offer - Crop Image Picker
**Required:** Add image picker for crop images

**Implementation:**
```typescript
import * as ImagePicker from 'expo-image-picker';

const [cropImage, setCropImage] = useState('');

const handleImagePick = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (!permissionResult.granted) {
    Alert.alert('Permission required', 'Please allow access to photos');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    setCropImage(result.assets[0].uri);
  }
};

// In JSX:
<TouchableOpacity onPress={handleImagePick}>
  <Text>Add Crop Image</Text>
</TouchableOpacity>
```

---

### 4. Database Verification Checklist

#### Tables to Verify:
- [ ] `farmer_crops` - Check structure and RLS
- [ ] `farmer_offers` - Check structure and RLS
- [ ] `profiles` - Check user data storage

#### RLS Policies to Check:
```sql
-- Enable RLS
ALTER TABLE farmer_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_offers ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can view own crops"
  ON farmer_crops FOR SELECT
  USING (auth.uid() = farmer_id);

-- Allow users to insert their own data
CREATE POLICY "Users can insert own crops"
  ON farmer_crops FOR INSERT
  WITH CHECK (auth.uid() = farmer_id);

-- Allow users to update their own data
CREATE POLICY "Users can update own crops"
  ON farmer_crops FOR UPDATE
  USING (auth.uid() = farmer_id);
```

---

## 🎯 Priority Order

### High Priority (Implement First):
1. ✅ Voice Input Hook (DONE)
2. Edit Crop → My Farms persistence
3. Add/Edit Offer save functionality
4. Nearby Buyers - Remove video call button

### Medium Priority:
5. Inline voice for Farmer Home search
6. Inline voice for My Farms search
7. Inline voice for Nearby Buyers search
8. Remove pincode microphone

### Low Priority:
9. Glass card design for map
10. Bottom navigation colors
11. Select Role inline voice

---

## 📝 Testing Checklist

After implementation:
- [ ] Test voice input on all pages
- [ ] Verify crops save and appear in My Farms
- [ ] Verify offers save correctly
- [ ] Test image picker in offers
- [ ] Check all navigation flows
- [ ] Verify database operations
- [ ] Test on physical device

---

## 🚀 Deployment

1. Test all changes locally
2. Fix any errors
3. Commit to Git
4. Push to GitHub
5. Build new APK
6. Test APK on device

---

## ⚠️ Important Notes

1. **Voice Input:** Uses Gemini API - ensure API key is configured
2. **Image Upload:** May need Supabase storage bucket setup
3. **Database:** Verify all table names match across files
4. **RLS:** Ensure policies allow user operations

---

## 📞 Need Help?

If any implementation fails:
1. Check console logs
2. Verify Supabase connection
3. Check API keys
4. Review RLS policies
5. Test with simple data first

---

**Status:** Hook created, implementation guide ready
**Next Step:** Implement fixes one by one, test thoroughly
