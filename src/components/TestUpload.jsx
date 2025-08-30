import React, { useState } from 'react';

const TestUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testUpload = async (file) => {
    setUploading(true);
    setError(null);
    setResult(null);

    try {
      console.log('📁 Selected file:', file.name, file.size, file.type);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      console.log('📤 Uploading to Cloudinary...');
      console.log('🔧 Cloud name:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
      console.log('🔧 Upload preset:', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Upload successful:', result);
        setResult(result);
        alert('Upload thành công!');
      } else {
        console.error('❌ Upload failed:', result);
        setError(result.error?.message || 'Upload failed');
      }

    } catch (error) {
      console.error('❌ Upload error:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      testUpload(file);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Test Cloudinary Upload</h2>
      
      {/* Environment Variables Display */}
      <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
        <p><strong>Cloud Name:</strong> {import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}</p>
        <p><strong>Upload Preset:</strong> {import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET}</p>
        <p><strong>API URL:</strong> {import.meta.env.VITE_API_BASE_URL}</p>
      </div>

      {/* File Input */}
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Upload Status */}
      {uploading && (
        <div className="mb-4 p-3 bg-blue-100 rounded text-blue-800">
          <div className="flex items-center">
            <div className="animate-spin mr-2">⏳</div>
            Uploading...
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 rounded text-red-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div className="mb-4 p-3 bg-green-100 rounded text-green-800">
          <p><strong>Upload Successful!</strong></p>
          <p className="text-sm break-all mt-2">
            <strong>URL:</strong> {result.secure_url}
          </p>
          <p className="text-sm mt-1">
            <strong>Size:</strong> {result.width}x{result.height}px
          </p>
          <p className="text-sm mt-1">
            <strong>Format:</strong> {result.format}
          </p>
          
          {/* Display uploaded image */}
          <div className="mt-3">
            <img 
              src={result.secure_url} 
              alt="Uploaded" 
              className="max-w-full h-auto rounded border"
              style={{ maxHeight: '200px' }}
            />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-3 bg-yellow-100 rounded text-sm text-yellow-800">
        <p><strong>Cách test:</strong></p>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Chọn file ảnh (JPG, PNG, WEBP)</li>
          <li>Upload sẽ tự động bắt đầu</li>
          <li>Check console (F12) để xem logs chi tiết</li>
          <li>Nếu thành công, ảnh sẽ hiển thị</li>
        </ol>
      </div>
    </div>
  );
};

export default TestUpload;
