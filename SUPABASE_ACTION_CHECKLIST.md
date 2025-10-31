# ✅ Supabase Setup Action Checklist

## 🎯 Phase 1: Verification (5 minutes)

- [ ] Check `.env` file exists in project root
- [ ] Verify `.env` contains all three keys:
  - [ ] `EXPO_PUBLIC_SUPABASE_URL`
  - [ ] `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Check `utils/supabase.ts` exists
- [ ] Verify `@supabase/supabase-js` is installed: `npm list @supabase/supabase-js`
- [ ] Check storage buckets in Supabase dashboard:
  - [ ] crop-images (public)
  - [ ] offer-images (public)
  - [ ] profile-images (public)
  - [ ] documents (private)
  - [ ] invoices (private)

---

## 🚀 Phase 2: Create Database Tables (Choose One)

### Option A: Automated Setup (Recommended) ⭐

```bash
npm run setup:supabase:direct
```

- [ ] Run command
- [ ] Wait for completion
- [ ] Check for errors
- [ ] If successful, skip to Phase 3
- [ ] If failed, use Option B

### Option B: Manual SQL Setup (Most Reliable)

1. [ ] Go to https://app.supabase.com
2. [ ] Login with your account
3. [ ] Click "SQL Editor" in left sidebar
4. [ ] Click "New Query"
5. [ ] Open `scripts/supabase-schema.sql` in your editor
6. [ ] Copy all content
7. [ ] Paste into Supabase SQL Editor
8. [ ] Click "Run" button
9. [ ] Wait for completion
10. [ ] Check for errors

### Option C: REST API Setup

```bash
npm run setup:supabase:rest
```

- [ ] Run command
- [ ] Wait for completion
- [ ] Check for errors

---

## ✅ Phase 3: Verification (10 minutes)

### Check Tables Created

- [ ] Go to https://app.supabase.com
- [ ] Click "Table Editor" in left sidebar
- [ ] Verify all 12 tables exist:
  - [ ] users
  - [ ] crops
  - [ ] offers
  - [ ] orders
  - [ ] cart_items
  - [ ] messages
  - [ ] notifications
  - [ ] wishlist
  - [ ] reviews
  - [ ] transport_requests
  - [ ] weather_data
  - [ ] market_prices

### Check Indexes Created

- [ ] Click on each table
- [ ] Verify indexes exist (should see 10 total)

### Check RLS Enabled

- [ ] Click on each table
- [ ] Verify "RLS" toggle is ON
- [ ] Verify policies exist

### Test SQL Query

- [ ] Go to SQL Editor
- [ ] Run test query:
  ```sql
  SELECT * FROM users LIMIT 1;
  ```
- [ ] Should return empty result (no error)

---

## 🔗 Phase 4: Test App Connection (15 minutes)

### Create Test Component

- [ ] Create `app/test-supabase.tsx`:
  ```typescript
  import { supabase } from '@/utils/supabase';
  import { useEffect, useState } from 'react';
  import { View, Text } from 'react-native';

  export default function TestSupabase() {
    const [status, setStatus] = useState('Testing...');

    useEffect(() => {
      testConnection();
    }, []);

    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .limit(1);
        
        if (error) {
          setStatus(`Error: ${error.message}`);
        } else {
          setStatus('✅ Connection successful!');
        }
      } catch (err) {
        setStatus(`Error: ${err.message}`);
      }
    };

    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">{status}</Text>
      </View>
    );
  }
  ```

### Test Connection

- [ ] Add route to test component in `app/_layout.tsx`
- [ ] Navigate to test page
- [ ] Should see "✅ Connection successful!"
- [ ] Check browser console for any errors

### Test Storage Upload

- [ ] Create test upload function:
  ```typescript
  const testUpload = async () => {
    const file = new File(['test'], 'test.txt');
    const { data, error } = await supabase.storage
      .from('crop-images')
      .upload('test/test.txt', file);
    
    if (error) console.error('Upload error:', error);
    else console.log('Upload success:', data);
  };
  ```
- [ ] Run test upload
- [ ] Check Supabase Storage for file

---

## 🎯 Phase 5: Connect UI to Database (1-2 hours)

### Update Farmer Offers Page

- [ ] Open `app/farmer-offers.tsx`
- [ ] Replace mock data with real queries:
  ```typescript
  const { data: offers } = await supabase
    .from('offers')
    .select('*')
    .eq('farmer_id', userId);
  ```
- [ ] Test page loads with real data
- [ ] Test filters work
- [ ] Test navigation works

### Update Add Offer Page

- [ ] Open `app/add-offer.tsx`
- [ ] Replace mock submit with real insert:
  ```typescript
  const { data, error } = await supabase
    .from('offers')
    .insert([{ farmer_id, title, price, quantity }]);
  ```
- [ ] Test form submission
- [ ] Verify data appears in offers page

### Update My Farms Page

- [ ] Open `app/my-farms.tsx`
- [ ] Replace mock data with real queries
- [ ] Test page loads with real data

### Update Nearby Crops Page

- [ ] Open `app/nearby-crops.tsx`
- [ ] Replace mock data with real queries
- [ ] Test page loads with real data

---

## 🔐 Phase 6: Authentication Setup (Optional - Next Phase)

- [ ] Set up Supabase Auth
- [ ] Create login page
- [ ] Create signup page
- [ ] Implement logout
- [ ] Store auth token
- [ ] Protect routes

---

## 📊 Phase 7: Real-Time Features (Optional - Next Phase)

- [ ] Set up real-time subscriptions for orders
- [ ] Set up real-time subscriptions for messages
- [ ] Set up real-time subscriptions for notifications
- [ ] Test real-time updates

---

## 🎉 Final Checklist

### Before Going Live

- [ ] All tables created and verified
- [ ] All storage buckets created and verified
- [ ] Database connection tested
- [ ] UI connected to database
- [ ] Mock data replaced with real data
- [ ] All pages tested with real data
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] No console errors
- [ ] No network errors

### Documentation

- [ ] README updated with setup instructions
- [ ] API documentation created
- [ ] Database schema documented
- [ ] Environment variables documented
- [ ] Deployment instructions created

---

## 📝 Notes

### If Setup Fails

1. Check `.env` file has correct credentials
2. Verify Supabase project is active
3. Check internet connection
4. Try manual SQL setup option
5. Check Supabase dashboard for errors

### Common Issues

| Issue | Solution |
|-------|----------|
| "Missing environment variables" | Check `.env` file |
| "Connection refused" | Check Supabase URL |
| "RLS policy violation" | Check user authentication |
| "Table already exists" | Normal - script skips existing tables |
| "Storage bucket already exists" | Normal - script skips existing buckets |

---

## ⏱️ Time Estimates

| Phase | Time |
|-------|------|
| Phase 1: Verification | 5 min |
| Phase 2: Create Tables | 5-10 min |
| Phase 3: Verification | 10 min |
| Phase 4: Test Connection | 15 min |
| Phase 5: Connect UI | 1-2 hours |
| Phase 6: Authentication | 1-2 hours |
| Phase 7: Real-Time | 1-2 hours |
| **Total** | **4-7 hours** |

---

## 🚀 Quick Start

```bash
# 1. Verify setup
npm list @supabase/supabase-js

# 2. Create tables
npm run setup:supabase:direct

# 3. Test connection
# Navigate to test page in app

# 4. Update UI
# Replace mock data with real queries

# 5. Done! 🎉
```

---

## 📞 Need Help?

- Check `SUPABASE_QUICK_REFERENCE.md` for code examples
- Check `SUPABASE_SETUP_GUIDE.md` for detailed instructions
- Check Supabase docs: https://supabase.com/docs
- Check Supabase dashboard: https://app.supabase.com

---

**Status**: Ready to start Phase 1 ✅

**Last Updated**: 2025-10-22

