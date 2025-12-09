-- Add image_url to messages if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'image_url') THEN
        ALTER TABLE public.messages ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- Create storage bucket for chat images if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-images', 'chat-images', true)
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
-- Enable RLS for objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload to chat-images
CREATE POLICY "Authenticated users can upload chat images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chat-images');

-- Allow authenticated users to view chat images
CREATE POLICY "Authenticated users can view chat images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'chat-images');

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete own chat images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'chat-images' AND owner = auth.uid());
