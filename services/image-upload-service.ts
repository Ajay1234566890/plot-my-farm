import { supabase } from '@/utils/supabase';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

/**
 * Image Upload Service
 * Handles uploading images to Supabase Storage
 */
class ImageUploadService {
  /**
   * Upload an image to Supabase Storage
   * @param uri - Local file URI from image picker
   * @param bucket - Storage bucket name (crop-images, profile-images, offer-images, chat-images)
   * @param folder - Optional folder path within bucket
   * @returns Public URL of uploaded image or null if failed
   */
  async uploadImage(
    uri: string,
    bucket: 'crop-images' | 'profile-images' | 'offer-images' | 'chat-images',
    folder?: string
  ): Promise<string | null> {
    try {
      console.log('📤 [IMAGE-UPLOAD] Starting upload:', { uri, bucket, folder });

      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = uri.split('.').pop() || 'jpg';
      const fileName = `${timestamp}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to ArrayBuffer
      const arrayBuffer = decode(base64);

      // Determine content type
      const contentType = this.getContentType(fileExt);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, arrayBuffer, {
          contentType,
          upsert: false,
        });

      if (error) {
        console.error('❌ [IMAGE-UPLOAD] Upload failed:', error);
        return null;
      }

      console.log('✅ [IMAGE-UPLOAD] Upload successful:', data.path);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      console.log('🔗 [IMAGE-UPLOAD] Public URL:', urlData.publicUrl);

      return urlData.publicUrl;
    } catch (error) {
      console.error('❌ [IMAGE-UPLOAD] Exception:', error);
      return null;
    }
  }

  /**
   * Upload crop image
   * @param uri - Local file URI
   * @param farmerId - Farmer ID for folder organization
   * @returns Public URL or null
   */
  async uploadCropImage(uri: string, farmerId: string): Promise<string | null> {
    return this.uploadImage(uri, 'crop-images', farmerId);
  }

  /**
   * Upload profile image
   * @param uri - Local file URI
   * @param userId - User ID for folder organization
   * @returns Public URL or null
   */
  async uploadProfileImage(uri: string, userId: string): Promise<string | null> {
    return this.uploadImage(uri, 'profile-images', userId);
  }

  /**
   * Upload offer image
   * @param uri - Local file URI
   * @param farmerId - Farmer ID for folder organization
   * @returns Public URL or null
   */
  async uploadOfferImage(uri: string, farmerId: string): Promise<string | null> {
    return this.uploadImage(uri, 'offer-images', farmerId);
  }

  /**
   * Delete an image from storage
   * @param bucket - Storage bucket name
   * @param path - File path in bucket
   * @returns True if successful, false otherwise
   */
  async deleteImage(
    bucket: 'crop-images' | 'profile-images' | 'offer-images',
    path: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);

      if (error) {
        console.error('❌ [IMAGE-UPLOAD] Delete failed:', error);
        return false;
      }

      console.log('✅ [IMAGE-UPLOAD] Image deleted:', path);
      return true;
    } catch (error) {
      console.error('❌ [IMAGE-UPLOAD] Delete exception:', error);
      return false;
    }
  }

  /**
   * Get content type from file extension
   */
  private getContentType(ext: string): string {
    const types: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
    };
    return types[ext.toLowerCase()] || 'image/jpeg';
  }
  /**
   * Upload chat image
   * @param uri - Local file URI
   * @param chatId - Chat ID for folder organization (optional, using general folder 'shared' or per chat)
   * @returns Public URL or null
   */
  async uploadChatImage(uri: string): Promise<string | null> {
    return this.uploadImage(uri, 'chat-images');
  }
}

export const imageUploadService = new ImageUploadService();

