const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadService = {
  uploadImage: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); // ✅ Sử dụng preset
      
      // Optional: Override folder từ preset
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      
      console.log('📤 Uploading with preset:', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Upload successful:', result);
      
      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        folder: result.folder,
        cloudinary_result: result
      };
      
    } catch (error) {
      console.error('❌ Upload error:', error);
      throw error;
    }
  }
};