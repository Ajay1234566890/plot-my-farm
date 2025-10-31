-- =====================================================
-- SIMPLIFIED STORAGE BUCKET RLS POLICIES
-- =====================================================
-- This script creates basic storage policies that should work
-- without requiring table ownership permissions
-- =====================================================

-- =====================================================
-- STORAGE OBJECTS POLICIES
-- =====================================================

-- Allow everyone to view files in public buckets
CREATE POLICY "Public files viewable by all" ON storage.objects
    FOR SELECT USING (bucket_id IN ('crop-images', 'offer-images', 'profile-images'));

-- Allow authenticated users to upload to public buckets
CREATE POLICY "Authenticated upload to public buckets" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id IN ('crop-images', 'offer-images', 'profile-images') AND 
        auth.role() = 'authenticated'
    );

-- Allow authenticated users to update files in public buckets
CREATE POLICY "Authenticated update public files" ON storage.objects
    FOR UPDATE USING (
        bucket_id IN ('crop-images', 'offer-images', 'profile-images') AND 
        auth.role() = 'authenticated'
    );

-- Allow authenticated users to delete files in public buckets
CREATE POLICY "Authenticated delete public files" ON storage.objects
    FOR DELETE USING (
        bucket_id IN ('crop-images', 'offer-images', 'profile-images') AND 
        auth.role() = 'authenticated'
    );

-- Allow authenticated users full access to private buckets
CREATE POLICY "Authenticated access private buckets" ON storage.objects
    FOR ALL USING (
        bucket_id IN ('documents', 'invoices') AND 
        auth.role() = 'authenticated'
    );

-- =====================================================
-- ALTERNATIVE: DEVELOPMENT-FRIENDLY POLICIES
-- =====================================================
-- If you're still having permission issues, try these instead:
-- (Comment out the above policies and uncomment these)

-- -- Allow all authenticated users full access to all storage
-- CREATE POLICY "Dev: Full storage access for authenticated users" ON storage.objects
--     FOR ALL USING (auth.role() = 'authenticated');

-- -- Allow public read access to public buckets
-- CREATE POLICY "Dev: Public read access" ON storage.objects
--     FOR SELECT USING (bucket_id IN ('crop-images', 'offer-images', 'profile-images'));

-- =====================================================
-- NOTES
-- =====================================================
-- If you still get permission errors:
-- 1. These policies should work with service role key
-- 2. Make sure you're running this in Supabase SQL Editor
-- 3. If it still fails, we may need to disable RLS temporarily for development
-- =====================================================
