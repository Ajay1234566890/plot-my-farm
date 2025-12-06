-- Add image_url column to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create index for faster image queries
CREATE INDEX IF NOT EXISTS idx_messages_image_url 
ON messages(image_url) 
WHERE image_url IS NOT NULL;

-- Update RLS policies if needed (messages table should already have proper RLS)
-- Ensure users can only see messages in their chats

-- Note: Make sure to create the 'chat-images' storage bucket in Supabase Dashboard
-- Bucket settings:
-- - Name: chat-images
-- - Public: Yes (for easy image access)
-- - File size limit: 5MB
-- - Allowed MIME types: image/jpeg, image/png, image/webp

-- RLS Policy for chat-images bucket (run in Supabase Dashboard > Storage > Policies):
-- Policy 1: Allow authenticated users to upload to their own folder
-- CREATE POLICY "Users can upload to own folder"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'chat-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy 2: Allow public read access
-- CREATE POLICY "Public read access"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'chat-images');

-- Policy 3: Allow users to delete their own images
-- CREATE POLICY "Users can delete own images"
-- ON storage.objects FOR DELETE
-- USING (bucket_id = 'chat-images' AND auth.uid()::text = (storage.foldername(name))[1]);
