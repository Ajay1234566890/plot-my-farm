# 🔍 Supabase Quick Reference Guide

## Import Supabase Client

```typescript
import { supabase } from '@/utils/supabase';
```

---

## 📖 Common Operations

### 1. Fetch Data

```typescript
// Fetch single record
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();

// Fetch multiple records
const { data, error } = await supabase
  .from('crops')
  .select('*')
  .eq('farmer_id', farmerId);

// Fetch with filters
const { data, error } = await supabase
  .from('offers')
  .select('*')
  .eq('status', 'active')
  .gt('price', 100)
  .order('created_at', { ascending: false });

// Fetch with limit
const { data, error } = await supabase
  .from('offers')
  .select('*')
  .limit(10);

// Fetch with pagination
const { data, error } = await supabase
  .from('offers')
  .select('*')
  .range(0, 9); // First 10 records
```

### 2. Insert Data

```typescript
// Insert single record
const { data, error } = await supabase
  .from('offers')
  .insert([
    {
      farmer_id: userId,
      title: 'Fresh Tomatoes',
      crop_type: 'Tomatoes',
      price: 45,
      quantity: 100,
      status: 'active'
    }
  ])
  .select();

// Insert multiple records
const { data, error } = await supabase
  .from('cart_items')
  .insert([
    { buyer_id: userId, offer_id: offerId1, quantity: 10 },
    { buyer_id: userId, offer_id: offerId2, quantity: 5 }
  ]);
```

### 3. Update Data

```typescript
// Update single record
const { data, error } = await supabase
  .from('offers')
  .update({ status: 'sold', updated_at: new Date() })
  .eq('id', offerId)
  .select();

// Update multiple records
const { data, error } = await supabase
  .from('crops')
  .update({ status: 'harvested' })
  .eq('farmer_id', farmerId)
  .eq('status', 'ready');
```

### 4. Delete Data

```typescript
// Delete single record
const { error } = await supabase
  .from('cart_items')
  .delete()
  .eq('id', cartItemId);

// Delete multiple records
const { error } = await supabase
  .from('wishlist')
  .delete()
  .eq('buyer_id', userId);
```

### 5. Upsert Data (Insert or Update)

```typescript
const { data, error } = await supabase
  .from('users')
  .upsert([
    {
      id: userId,
      email: 'user@example.com',
      full_name: 'John Doe',
      role: 'farmer'
    }
  ])
  .select();
```

---

## 🖼️ Storage Operations

### Upload File

```typescript
const { data, error } = await supabase.storage
  .from('crop-images')
  .upload(`${userId}/${filename}`, file);

// Get public URL
const { data: urlData } = supabase.storage
  .from('crop-images')
  .getPublicUrl(`${userId}/${filename}`);

const publicUrl = urlData.publicUrl;
```

### Download File

```typescript
const { data, error } = await supabase.storage
  .from('documents')
  .download(`${userId}/${filename}`);
```

### Delete File

```typescript
const { error } = await supabase.storage
  .from('crop-images')
  .remove([`${userId}/${filename}`]);
```

### List Files

```typescript
const { data, error } = await supabase.storage
  .from('crop-images')
  .list(`${userId}/`);
```

---

## 🔔 Real-Time Subscriptions

### Subscribe to Changes

```typescript
const subscription = supabase
  .from('offers')
  .on('*', (payload) => {
    console.log('Change received!', payload);
  })
  .subscribe();

// Unsubscribe
subscription.unsubscribe();
```

### Subscribe to Specific Events

```typescript
supabase
  .from('orders')
  .on('INSERT', (payload) => {
    console.log('New order:', payload.new);
  })
  .on('UPDATE', (payload) => {
    console.log('Order updated:', payload.new);
  })
  .on('DELETE', (payload) => {
    console.log('Order deleted:', payload.old);
  })
  .subscribe();
```

---

## 🔐 Authentication

### Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});
```

### Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

### Get Current User

```typescript
const { data: { user } } = await supabase.auth.getUser();
```

### Sign Out

```typescript
await supabase.auth.signOut();
```

---

## 📊 Advanced Queries

### Join Tables

```typescript
const { data, error } = await supabase
  .from('orders')
  .select(`
    *,
    users:buyer_id(full_name, email),
    offers:offer_id(title, price)
  `)
  .eq('farmer_id', farmerId);
```

### Aggregate Functions

```typescript
const { data, error } = await supabase
  .from('orders')
  .select('total_price')
  .eq('farmer_id', farmerId);

// Calculate sum in app
const totalRevenue = data?.reduce((sum, order) => sum + order.total_price, 0);
```

### Count Records

```typescript
const { count, error } = await supabase
  .from('offers')
  .select('*', { count: 'exact', head: true })
  .eq('farmer_id', farmerId);
```

### Search Text

```typescript
const { data, error } = await supabase
  .from('crops')
  .select('*')
  .ilike('name', `%${searchTerm}%`);
```

---

## ⚠️ Error Handling

```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();

if (error) {
  console.error('Error:', error.message);
  // Handle error
} else {
  console.log('Success:', data);
  // Use data
}
```

---

## 🎯 Common Patterns

### Fetch User Profile with Crops

```typescript
const { data: user, error: userError } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();

const { data: crops, error: cropsError } = await supabase
  .from('crops')
  .select('*')
  .eq('farmer_id', userId);
```

### Create Order with Cart Items

```typescript
// 1. Create order
const { data: order, error: orderError } = await supabase
  .from('orders')
  .insert([
    {
      buyer_id: userId,
      farmer_id: farmerId,
      offer_id: offerId,
      quantity: 10,
      total_price: 450
    }
  ])
  .select()
  .single();

// 2. Clear cart
const { error: cartError } = await supabase
  .from('cart_items')
  .delete()
  .eq('buyer_id', userId);
```

### Update Offer Status

```typescript
const { data, error } = await supabase
  .from('offers')
  .update({
    status: 'sold',
    updated_at: new Date().toISOString()
  })
  .eq('id', offerId)
  .select();
```

---

## 📝 TypeScript Types

```typescript
// User type
interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'farmer' | 'buyer' | 'admin';
  profile_image_url: string;
  bio: string;
  location: string;
  latitude: number;
  longitude: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Offer type
interface Offer {
  id: string;
  farmer_id: string;
  crop_id: string;
  title: string;
  crop_type: string;
  price: number;
  quantity: number;
  unit: string;
  status: 'active' | 'sold' | 'expired';
  created_at: string;
  updated_at: string;
}

// Order type
interface Order {
  id: string;
  buyer_id: string;
  farmer_id: string;
  offer_id: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}
```

---

## 🚀 Performance Tips

1. **Use `.select()` to specify columns**
   ```typescript
   .select('id, title, price') // Instead of .select('*')
   ```

2. **Use `.limit()` for large datasets**
   ```typescript
   .limit(10) // Fetch only 10 records
   ```

3. **Use indexes for frequently queried columns**
   - Already created for: farmer_id, buyer_id, offer_id, etc.

4. **Use `.single()` when expecting one record**
   ```typescript
   .single() // Throws error if more than one record
   ```

5. **Batch operations when possible**
   ```typescript
   .insert([record1, record2, record3]) // Instead of 3 separate inserts
   ```

---

**Last Updated**: 2025-10-22

