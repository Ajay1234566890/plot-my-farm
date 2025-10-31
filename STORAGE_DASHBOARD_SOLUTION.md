# 🔧 STORAGE POLICIES - DASHBOARD UI SOLUTION

## 🚨 **KNOWN SUPABASE LIMITATION**

The error `must be owner of table objects` is a **known Supabase limitation**. Even service role keys cannot create RLS policies on system storage tables via SQL.

**Root Cause**: `storage.objects` and `storage.buckets` are core system tables owned by `supabase_storage_admin`, not your project.

---

## ✅ **SOLUTION: Use Supabase Dashboard UI**

The **only reliable way** to create storage policies is through the Supabase Dashboard UI.

### **Step 1: Create Storage Policies via Dashboard**

1. Go to [Supabase Dashboard](https://app.supabase.com/project/dlwbvoqowqiugyjdfyax)
2. Navigate to **Storage** → **Policies** (in left sidebar)
3. You should see `storage.objects` and `storage.buckets` tables
4. Click **"New Policy"** for `storage.objects`

### **Step 2: Create These Policies**

**Policy 1: Public Bucket Read Access**
- **Table**: `storage.objects`
- **Policy Name**: `Public files viewable by all`
- **Operation**: `SELECT`
- **Target Roles**: `public`
- **USING Expression**: 
  ```sql
  bucket_id IN ('crop-images', 'offer-images', 'profile-images')
  ```

**Policy 2: Authenticated Upload to Public Buckets**
- **Table**: `storage.objects`
- **Policy Name**: `Authenticated upload to public buckets`
- **Operation**: `INSERT`
- **Target Roles**: `authenticated`
- **WITH CHECK Expression**:
  ```sql
  bucket_id IN ('crop-images', 'offer-images', 'profile-images')
  ```

**Policy 3: Authenticated Access to Private Buckets**
- **Table**: `storage.objects`
- **Policy Name**: `Authenticated access private buckets`
- **Operation**: `ALL`
- **Target Roles**: `authenticated`
- **USING Expression**:
  ```sql
  bucket_id IN ('documents', 'invoices')
  ```

**Policy 4: Bucket Visibility**
- **Table**: `storage.buckets`
- **Policy Name**: `Buckets visible to authenticated users`
- **Operation**: `SELECT`
- **Target Roles**: `authenticated`
- **USING Expression**: `true`

---

## 🔄 **ALTERNATIVE: TEMPORARY WORKAROUND**

If the Dashboard UI also fails, try this **temporary development workaround**:

### **Option A: Make Postgres User Superuser (Temporary)**

**⚠️ WARNING: This is a security risk - only for development!**

1. In Supabase SQL Editor, run:
   ```sql
   ALTER USER postgres WITH SUPERUSER;
   ```

2. Then apply the storage policies:
   ```sql
   ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
   ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;
   ```

3. **IMPORTANT**: Revert after testing:
   ```sql
   ALTER USER postgres WITH NOSUPERUSER;
   ```

### **Option B: Use Service Role Key in App (Development Only)**

Temporarily modify your app to use the service role key instead of anon key for storage operations:

1. In `utils/supabase.ts`, create a separate client for storage:
   ```typescript
   // For storage operations only (development)
   export const supabaseStorage = createClient(
     process.env.EXPO_PUBLIC_SUPABASE_URL || '',
     process.env.SUPABASE_SERVICE_ROLE_KEY || ''
   );
   ```

2. Use `supabaseStorage` for file uploads/downloads
3. **IMPORTANT**: Remove this before production!

---

## 🧪 **TEST THE SOLUTION**

After creating policies via Dashboard UI:

```bash
npm run test:storage
```

**Expected Results:**
```
✅ Anon key: Found 5 buckets
✅ Admin key: Found 5 buckets  
✅ File upload: Successful
✅ File operations: Working
🎯 Overall Status: ✅ STORAGE READY
```

---

## 📋 **WHY THIS HAPPENS**

### **Supabase Architecture Limitation**
- Storage tables are **system tables** with special ownership
- SQL-based policy creation is **restricted by design**
- Dashboard UI has **special permissions** to create storage policies
- This affects **all Supabase projects**, not just yours

### **Common Workarounds**
1. **Dashboard UI**: Most reliable method
2. **Superuser approach**: Temporary, security risk
3. **Service role in app**: Development only
4. **Wait for Supabase fix**: Long-term solution

---

## 🎯 **RECOMMENDED APPROACH**

### **For Development (Now)**
1. **Try Dashboard UI first** (most likely to work)
2. **If UI fails, use temporary superuser approach**
3. **Get storage working for development**

### **For Production (Later)**
1. **Use Dashboard UI for policies** (proper way)
2. **Test with restricted permissions**
3. **Remove any temporary workarounds**

---

## 🚀 **NEXT STEPS**

1. **Try Dashboard UI approach** (15 minutes)
2. **If that fails, try superuser workaround** (5 minutes)
3. **Test storage functionality** (`npm run test:storage`)
4. **Continue with app development**
5. **Revisit storage security before production**

---

## 📝 **IMPORTANT NOTES**

- This is a **known Supabase limitation**, not your fault
- **Dashboard UI is the official way** to create storage policies
- **Temporary workarounds are acceptable** for development
- **Security can be properly configured** before production
- **Your app functionality is the priority** right now

The goal is to get your storage working so you can continue developing your app! 🎯
