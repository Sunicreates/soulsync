import supabase from './supabase';

class StorageService {
  constructor() {
    this.bucket = 'profiles';
  }

  // Upload profile photo
  async uploadPhoto(file, userId, folder = 'avatars') {
    try {
      if (!file) {
        return { success: false, error: 'No file provided' };
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return { success: false, error: 'Only JPEG, PNG and WebP images are allowed' };
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return { success: false, error: 'File size must be less than 5MB' };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from(this.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.bucket)
        .getPublicUrl(filePath);

      return {
        success: true,
        data: {
          path: data.path,
          url: urlData?.publicUrl
        }
      };
    } catch (error) {
      console.log('Upload error:', error);
      return { success: false, error: 'Failed to upload file' };
    }
  }

  // Delete file
  async deleteFile(filePath) {
    try {
      const { error } = await supabase.storage
        .from(this.bucket)
        .remove([filePath]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.log('Delete error:', error);
      return { success: false, error: 'Failed to delete file' };
    }
  }

  // Get file URL
  getPublicUrl(filePath) {
    try {
      const { data } = supabase.storage
        .from(this.bucket)
        .getPublicUrl(filePath);

      return data?.publicUrl || null;
    } catch (error) {
      console.log('Get URL error:', error);
      return null;
    }
  }

  // Create profile photo preview
  createPreview(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  }
}

const storageService = new StorageService();
export default storageService;