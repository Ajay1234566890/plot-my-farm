-- =====================================================
-- DISABLE STORAGE RLS FOR DEVELOPMENT
-- =====================================================
-- This temporarily disables RLS on storage tables
-- to allow file operations during development
-- =====================================================

-- Disable RLS on storage objects table
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Disable RLS on storage buckets table  
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- WHAT THIS DOES
-- =====================================================
-- ✅ Allows anonymous key to see storage buckets
-- ✅ Allows file upload/download operations
-- ✅ Enables storage functionality for development
-- ⚠️  Removes storage security (development only!)
-- =====================================================

-- =====================================================
-- FOR PRODUCTION
-- =====================================================
-- Before deploying to production, you should:
-- 1. Re-enable RLS: ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
-- 2. Create proper storage policies through Supabase dashboard
-- 3. Test with restricted permissions
-- =====================================================
