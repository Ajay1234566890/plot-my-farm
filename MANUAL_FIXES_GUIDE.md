# Manual Fixes Required - Step-by-Step Guide

This document provides exact instructions for the remaining fixes that need to be applied manually.

---

## Fix #1: Make Crop Cards Clickable in My Farms

**File**: `app/my-farms.tsx`  
**Lines**: 302-384  
**Priority**: HIGH

### Current Code (Line 302-314):
```typescript
{filteredCrops.map((crop) => (
  <View
    key={crop.id}
    className="bg-white rounded-3xl overflow-hidden mb-6 shadow-lg"
    style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
    }}
  >
```

### Replace With:
```typescript
{filteredCrops.map((crop) => (
  <TouchableOpacity
    key={crop.id}
    onPress={() => router.push({
      pathname: "/crop-details",
      params: { cropId: crop.id }
    })}
    className="bg-white rounded-3xl overflow-hidden mb-6 shadow-lg"
    style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
    }}
  >
```

### Current Code (Line 384):
```typescript
              </View>
            ))}\r
          </View>\r
```

### Replace With:
```typescript
              </TouchableOpacity>
            ))}\r
          </View>\r
```

### Steps:
1. Open `app/my-farms.tsx`
2. Find line 304: `<View`
3. Replace with: `<TouchableOpacity`
4. Add the `onPress` prop after `key={crop.id}`
5. Find line 384: `</View>`
6. Replace with: `</TouchableOpacity>`
7. Save the file

---

## Fix #2: Remove Filter Icon from Nearby Crops

**File**: `app/nearby-crops.tsx`  
**Lines**: ~90-95  
**Priority**: MEDIUM

### Find and Remove:
Look for the filter icon in the header section (around line 90-95):
```typescript
<TouchableOpacity className="p-2">
  <Filter size={20} color="#4B5563" />
</TouchableOpacity>
```

### Steps:
1. Open `app/nearby-crops.tsx`
2. Search for `<Filter` component
3. Delete the entire `TouchableOpacity` wrapper containing the Filter icon
4. Save the file

---

## Fix #3: Make Crop Items Clickable in Nearby Crops

**File**: `app/nearby-crops.tsx`  
**Line**: ~156  
**Priority**: MEDIUM

### Current Code:
```typescript
<TouchableOpacity
  key={crop.id}
  className="bg-white rounded-xl shadow-sm overflow-hidden"
  style={{
    shadowColor: '#B27E4C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#B27E4C10'
  }}
>
```

### Add onPress Handler:
```typescript
<TouchableOpacity
  key={crop.id}
  onPress={() => router.push({
    pathname: "/buyer-crop-details",
    params: { cropId: crop.id }
  })}
  className="bg-white rounded-xl shadow-sm overflow-hidden"
  style={{
    shadowColor: '#B27E4C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#B27E4C10'
  }}
>
```

### Steps:
1. Open `app/nearby-crops.tsx`
2. Find the `TouchableOpacity` component around line 156
3. Add the `onPress` prop with navigation to buyer crop details
4. Save the file

---

## Fix #4: Add Photo Upload to Chat Screens

**Files**: 
- `app/chat-screen.tsx`
- `app/buyer-chat-screen.tsx`

**Priority**: MEDIUM

### Step 1: Install Dependencies (if needed)
```bash
npm install expo-image-picker
```

### Step 2: Add Import
Add this to the top of both chat screen files:
```typescript
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/utils/supabase';
```

### Step 3: Add Image Upload Function
Add this function inside the component (after other handlers):
```typescript
const handlePickImage = async () => {
  try {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to upload images.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled) return;

    const imageUri = result.assets[0].uri;
    
    // Upload to Supabase Storage
    const fileName = `chat-${Date.now()}.jpg`;
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: fileName,
      type: 'image/jpeg',
    } as any);

    const { data, error } = await supabase.storage
      .from('chat-images')
      .upload(fileName, formData);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('chat-images')
      .getPublicUrl(fileName);

    // Send message with image
    await sendMessage(chatId, user!.id, '', publicUrl);
    
  } catch (error) {
    console.error('Error uploading image:', error);
    Alert.alert('Upload Failed', 'Could not upload image. Please try again.');
  }
};
```

### Step 4: Connect to Media Icon
Find the media icon button (look for `<Image>` or `<Camera>` icon) and add:
```typescript
<TouchableOpacity onPress={handlePickImage}>
  <Image size={24} color="#6B7280" />
</TouchableOpacity>
```

### Steps:
1. Open both chat screen files
2. Add the imports at the top
3. Add the `handlePickImage` function
4. Connect it to the media icon button
5. Test image upload functionality
6. Save both files

---

## Fix #5: Hide Phone Icon When No Number Available

**Files**: 
- `app/chat-screen.tsx`
- `app/buyer-chat-screen.tsx`

**Priority**: LOW

### Current Code (in header):
```typescript
<TouchableOpacity onPress={handleCall}>
  <Phone size={20} color="#FFFFFF" />
</TouchableOpacity>
```

### Replace With:
```typescript
{phoneNumber && (
  <TouchableOpacity onPress={handleCall}>
    <Phone size={20} color="#FFFFFF" />
  </TouchableOpacity>
)}
```

### Steps:
1. Open both chat screen files
2. Find the Phone icon TouchableOpacity
3. Wrap it in a conditional render checking for `phoneNumber`
4. Save both files

---

## Fix #6: Create Saved Buyers Table (Database)

**Priority**: LOW

### SQL Script:
Run this in your Supabase SQL editor:

```sql
-- Create saved_buyers table
CREATE TABLE IF NOT EXISTS saved_buyers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(farmer_id, buyer_id)
);

-- Add RLS policies
ALTER TABLE saved_buyers ENABLE ROW LEVEL SECURITY;

-- Farmers can view their own saved buyers
CREATE POLICY "Farmers can view their saved buyers"
  ON saved_buyers FOR SELECT
  USING (auth.uid() = farmer_id);

-- Farmers can insert their own saved buyers
CREATE POLICY "Farmers can save buyers"
  ON saved_buyers FOR INSERT
  WITH CHECK (auth.uid() = farmer_id);

-- Farmers can delete their own saved buyers
CREATE POLICY "Farmers can unsave buyers"
  ON saved_buyers FOR DELETE
  USING (auth.uid() = farmer_id);

-- Create index for faster queries
CREATE INDEX idx_saved_buyers_farmer_id ON saved_buyers(farmer_id);
CREATE INDEX idx_saved_buyers_buyer_id ON saved_buyers(buyer_id);
```

### Steps:
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Paste the above script
4. Run the script
5. Verify tables and policies are created

---

## Testing Checklist

After applying all fixes, test the following:

### Navigation Tests:
- [ ] Click "Market Prices" in Farmer Home → Opens real market prices page
- [ ] Click "Market Prices" in Buyer Home → Opens real market prices page
- [ ] Click crop card in Farmer Home "My Fields" → Opens crop details
- [ ] Click crop card in My Farms → Opens crop details
- [ ] Click crop item in Nearby Crops → Opens buyer crop details

### Data Tests:
- [ ] Recommended Buyers shows real recent contacts (not mock data)
- [ ] Market prices show correct crop images
- [ ] All crop names have proper images (check problematic ones)
- [ ] No mock data visible anywhere

### Chat Tests:
- [ ] Send text message → Appears in both chats instantly
- [ ] Upload photo → Uploads successfully and displays
- [ ] Phone icon hidden when no number available
- [ ] Voice/video call works (if fixed)

### Database Tests:
- [ ] Saved buyers table exists
- [ ] Can save/unsave buyers
- [ ] RLS policies work correctly

---

## Common Issues & Solutions

### Issue: "Cannot find name 'TouchableOpacity'"
**Solution**: Make sure `TouchableOpacity` is imported at the top:
```typescript
import { TouchableOpacity } from 'react-native';
```

### Issue: "router is not defined"
**Solution**: Make sure `useRouter` is imported and called:
```typescript
import { useRouter } from 'expo-router';
// Inside component:
const router = useRouter();
```

### Issue: Image upload fails
**Solution**: 
1. Check Supabase storage bucket exists (`chat-images`)
2. Verify bucket is public
3. Check RLS policies allow uploads

### Issue: Phone icon still shows without number
**Solution**: Make sure you're checking the correct variable name (`phoneNumber`, `farmerPhone`, etc.)

---

## Need Help?

If you encounter any issues:
1. Check the console for error messages
2. Verify all imports are correct
3. Make sure Supabase connection is working
4. Test on a real device if using camera/gallery features

---

**Last Updated**: December 4, 2025
**Version**: 1.0
