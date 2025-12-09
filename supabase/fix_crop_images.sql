-- 1. Ensure image_url column exists in farmer_crops
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farmer_crops' AND column_name = 'image_url') THEN
        ALTER TABLE public.farmer_crops ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- 2. Enable RLS on farmer_crops (safe to run multiple times, but good practice to check if you could, mostly harmless to re-run on user tables)
ALTER TABLE public.farmer_crops ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for farmer_crops (Drop first to avoid "policy already exists" error)
DROP POLICY IF EXISTS "Public can view crops" ON public.farmer_crops;
CREATE POLICY "Public can view crops" ON public.farmer_crops FOR SELECT USING (true);

DROP POLICY IF EXISTS "Farmers can insert own crops" ON public.farmer_crops;
CREATE POLICY "Farmers can insert own crops" ON public.farmer_crops FOR INSERT TO authenticated WITH CHECK (farmer_id = auth.uid());

DROP POLICY IF EXISTS "Farmers can update own crops" ON public.farmer_crops;
CREATE POLICY "Farmers can update own crops" ON public.farmer_crops FOR UPDATE TO authenticated USING (farmer_id = auth.uid());

DROP POLICY IF EXISTS "Farmers can delete own crops" ON public.farmer_crops;
CREATE POLICY "Farmers can delete own crops" ON public.farmer_crops FOR DELETE TO authenticated USING (farmer_id = auth.uid());


-- 4. Create 'crop-images' storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('crop-images', 'crop-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;


-- 5. Storage Policies (Note: We skip 'ALTER TABLE storage.objects ENABLE RLS' as it requires superuser and is usually on by default)

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Public Access to Crop Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload crop images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own crop images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own crop images" ON storage.objects;

-- Re-create policies
CREATE POLICY "Public Access to Crop Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'crop-images');

CREATE POLICY "Authenticated users can upload crop images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'crop-images');

CREATE POLICY "Users can update own crop images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'crop-images' AND owner = auth.uid());

CREATE POLICY "Users can delete own crop images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'crop-images' AND owner = auth.uid());
