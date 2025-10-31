-- =====================================================
-- FIX ANON KEY BUCKET VISIBILITY ISSUE
-- =====================================================
-- This script fixes the issue where anon key finds 0 buckets
-- Root cause: storage.buckets RLS policy too restrictive
-- Solution: Allow anon users to see ALL buckets
-- =====================================================

-- Step 1: Drop existing restrictive bucket policies
DROP POLICY IF EXISTS "Public buckets are visible to everyone" ON storage.buckets;
DROP POLICY IF EXISTS "Private buckets visible to authenticated users" ON storage.buckets;
DROP POLICY IF EXISTS "Allow everyone to see all buckets" ON storage.buckets;

-- Step 2: Create new permissive bucket visibility policy
-- This allows anon users to see ALL buckets (but not access private files)
CREATE POLICY "Allow everyone to see all buckets" 
ON storage.buckets 
FOR SELECT 
TO public 
USING (true);

-- Step 3: Ensure RLS is enabled on storage.buckets
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Step 4: Ensure proper object policies exist
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing object policies to avoid conflicts
DROP POLICY IF EXISTS "Public bucket files are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update public bucket files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete public bucket files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can access private bucket files" ON storage.objects;
DROP POLICY IF EXISTS "Public files viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload to public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update public files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete public files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated access private buckets" ON storage.objects;

-- Create optimal object policies
-- Allow everyone to view files in public buckets
CREATE POLICY "Public files viewable by everyone" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id IN ('crop-images', 'offer-images', 'profile-images'));

-- Allow authenticated users to upload to public buckets
CREATE POLICY "Authenticated upload to public buckets" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id IN ('crop-images', 'offer-images', 'profile-images'));

-- Allow authenticated users to update files in public buckets
CREATE POLICY "Authenticated update public files" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id IN ('crop-images', 'offer-images', 'profile-images'));

-- Allow authenticated users to delete files in public buckets
CREATE POLICY "Authenticated delete public files" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id IN ('crop-images', 'offer-images', 'profile-images'));

-- Allow authenticated users full access to private buckets
CREATE POLICY "Authenticated access private buckets" 
ON storage.objects 
FOR ALL 
TO authenticated 
USING (bucket_id IN ('documents', 'invoices'));

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these queries to verify the fix worked:

-- 1. Check bucket policies
-- SELECT schemaname, tablename, policyname, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'buckets' AND schemaname = 'storage';

-- 2. Check object policies  
-- SELECT schemaname, tablename, policyname, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'objects' AND schemaname = 'storage';

-- =====================================================
-- EXPECTED RESULT
-- =====================================================
-- After running this script:
-- ✅ Anon key should find 5 buckets (instead of 0)
-- ✅ File uploads should work for authenticated users
-- ✅ Public files should be viewable by everyone
-- ✅ Private files should require authentication
-- =====================================================

-- Test with: npm run test:storage-simple
