import React, { useState, useRef } from 'react';

const ImageUpload = ({
  onUpload,
  onUploadError,
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  className = '',
  children
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null); 
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Chỉ chấp nhận các định dạng: ${allowedTypes.map(type => type.split('/')[1]).join(', ').toUpperCase()}`);
    }
    
    // Check file size
    if (file.size > maxSize) {
      throw new Error(`Kích thước file tối đa ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
    }
    
    return true;
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    console.log(file);
    try {
      validateFile(file);
      
      // Start upload
      setUploading(true);
      setProgress(0);

      const result = await onUpload(file);
      
    } catch (error) {
      console.error('❌ Upload failed:', error);
      if (onUploadError) {
        onUploadError(error.message);
      }
    } finally {
      setUploading(false);
      setProgress(0);
      // Clean up preview
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`image-upload ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      
      <div onClick={triggerFileSelect} className={`cursor-pointer ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
        {children || (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to {(maxSize / 1024 / 1024).toFixed(1)}MB</p>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Uploading...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Preview */}
      {preview && !uploading && (
        <div className="mt-4">
          <img src={preview} alt="Preview" className="max-w-full h-32 object-cover rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;