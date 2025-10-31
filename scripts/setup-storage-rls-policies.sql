-- =====================================================
-- STORAGE BUCKET RLS POLICIES FOR PLOT MY FARM APP
-- =====================================================
-- This script creates RLS policies for storage buckets
-- to fix file upload/download issues
-- =====================================================

-- Enable RLS on storage objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- BUCKET VISIBILITY POLICIES
-- =====================================================

-- Allow everyone to see public buckets
CREATE POLICY "Public buckets are visible to everyone" ON storage.buckets
    FOR SELECT USING (
        name IN ('crop-images', 'offer-images', 'profile-images')
    );

-- Allow authenticated users to see private buckets
CREATE POLICY "Private buckets visible to authenticated users" ON storage.buckets
    FOR SELECT USING (
        name IN ('documents', 'invoices') AND 
        auth.role() = 'authenticated'
    );

-- =====================================================
-- PUBLIC BUCKET POLICIES (crop-images, offer-images, profile-images)
-- =====================================================

-- Anyone can view files in public buckets
CREATE POLICY "Public bucket files are viewable by everyone" ON storage.objects
    FOR SELECT USING (
        bucket_id IN ('crop-images', 'offer-images', 'profile-images')
    );

-- Authenticated users can upload to public buckets
CREATE POLICY "Authenticated users can upload to public buckets" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id IN ('crop-images', 'offer-images', 'profile-images') AND 
        auth.role() = 'authenticated'
    );

-- Authenticated users can update files in public buckets
CREATE POLICY "Authenticated users can update public bucket files" ON storage.objects
    FOR UPDATE USING (
        bucket_id IN ('crop-images', 'offer-images', 'profile-images') AND 
        auth.role() = 'authenticated'
    );

-- Authenticated users can delete files in public buckets
CREATE POLICY "Authenticated users can delete public bucket files" ON storage.objects
    FOR DELETE USING (
        bucket_id IN ('crop-images', 'offer-images', 'profile-images') AND 
        auth.role() = 'authenticated'
    );

-- =====================================================
-- PRIVATE BUCKET POLICIES (documents, invoices)
-- =====================================================

-- Only authenticated users can access private bucket files
CREATE POLICY "Authenticated users can access private bucket files" ON storage.objects
    FOR ALL USING (
        bucket_id IN ('documents', 'invoices') AND 
        auth.role() = 'authenticated'
    );

-- =====================================================
-- ALTERNATIVE: SIMPLIFIED DEVELOPMENT POLICIES
-- =====================================================
-- If the above policies are too restrictive for development,
-- uncomment the following policies and comment out the above ones:

-- -- Allow all authenticated users full access to all buckets (DEVELOPMENT ONLY)
-- CREATE POLICY "Dev: Authenticated users can access all storage" ON storage.objects
--     FOR ALL USING (auth.role() = 'authenticated');

-- -- Allow everyone to view public bucket files
-- CREATE POLICY "Dev: Public files viewable by all" ON storage.objects
--     FOR SELECT USING (bucket_id IN ('crop-images', 'offer-images', 'profile-images'));

-- -- Allow everyone to see all buckets (DEVELOPMENT ONLY)
-- CREATE POLICY "Dev: All buckets visible" ON storage.buckets
--     FOR SELECT USING (true);

-- =====================================================
-- SUMMARY
-- =====================================================
-- These policies ensure:
-- 1. Public buckets (crop-images, offer-images, profile-images) are accessible to everyone for viewing
-- 2. Only authenticated users can upload/modify files
-- 3. Private buckets (documents, invoices) require authentication for all operations
-- 4. Bucket listing works properly for both public and private buckets
-- 5. File upload/download operations are allowed with proper permissions
-- =====================================================
