import React, { useState } from 'react';
import { PhotoIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

const ImageUpload = ({ images, onUpload, onRemove, maxImages = 4 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      throw new Error(`${file.name} is not a valid image file.`);
    }
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`${file.name} is too large. Maximum size is 5MB.`);
    }
    
    return true;
  };

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      try {
        validateFile(file);
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target.result;
          
          if (!result || typeof result !== 'string' || !result.startsWith('data:image/')) {
            reject(new Error(`Invalid image data for ${file.name}`));
            return;
          }

          const imageData = {
            id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            file: file,
            url: result,
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
          };
          
          console.log('✅ Image processed successfully:', imageData.name);
          resolve(imageData);
        };
        
        reader.onerror = (err) => {
          console.error('❌ FileReader error:', err);
          reject(new Error(`Failed to read file: ${file.name}`));
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleImageUpload = async (files) => {
    if (files.length + images.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed. You can add ${maxImages - images.length} more.`);
      return;
    }

    setUploading(true);
    
    try {
      console.log('🔄 Processing', files.length, 'files...');
      
      const processedImages = await Promise.all(
        Array.from(files).map(file => processFile(file))
      );
      
      console.log('✅ All images processed:', processedImages.length);
      processedImages.forEach(imageData => onUpload(imageData));
    } catch (error) {
      console.error('❌ Upload error:', error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files);
    }
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleImageLoad = (index, event) => {
    console.log(`✅ Image ${index} loaded successfully`);
    console.log(`📐 Natural dimensions: ${event.target.naturalWidth}x${event.target.naturalHeight}`);
    setImageErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleImageError = (index, image, error) => {
    console.error(`❌ Image ${index} failed to load:`, image.name, error);
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isMaxReached = images.length >= maxImages;

  return (
    <div className="mb-4">
      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((image, index) => {
              console.log(`🖼️ Rendering image ${index}:`, {
                name: image.name,
                hasUrl: !!image.url,
                urlStart: image.url?.substring(0, 50)
              });
              
              return (
                <div key={image.id || index} className="relative group">
                  {/* Square Container with simple styling */}
                  <div 
                    className="relative overflow-hidden rounded-lg border border-gray-300"
                    style={{
                      width: '100%',
                      paddingBottom: '100%', // Creates 1:1 aspect ratio
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    {/* Error State */}
                    {imageErrors[index] ? (
                      <div 
                        className="absolute inset-0 flex flex-col items-center justify-center bg-red-100 text-red-600"
                        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
                      >
                        <PhotoIcon className="w-8 h-8 mb-2" />
                        <span className="text-xs text-center px-2">Load Error</span>
                      </div>
                    ) : (
                      /* Simple Image Display */
                      <img
                        src={image.url}
                        alt={image.name || `Image ${index + 1}`}
                        onLoad={(e) => handleImageLoad(index, e)}
                        onError={(e) => handleImageError(index, image, e)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          backgroundColor: '#e5e7eb',
                          border: 'none',
                          outline: 'none'
                        }}
                      />
                    )}
                    
                    {/* Simple Remove Button */}
                    <button
                      type="button"
                      onClick={() => onRemove(index)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '28px',
                        height: '28px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        opacity: 0,
                        transition: 'opacity 0.2s'
                      }}
                      className="group-hover:opacity-100"
                      title="Remove image"
                    >
                      <XMarkIcon style={{ width: '14px', height: '14px' }} />
                    </button>

                    {/* Simple Index Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '8px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        zIndex: 10
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* File Size Badge */}
                    {image.size && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          zIndex: 10
                        }}
                      >
                        {formatFileSize(image.size)}
                      </div>
                    )}
                  </div>

                  {/* Image Name */}
                  <div className="mt-1 text-xs text-gray-600 truncate" title={image.name}>
                    {image.name || `Image ${index + 1}`}
                  </div>
                </div>
              );
            })}
            
            {/* Add More Button */}
            {!isMaxReached && (
              <div 
                style={{
                  width: '100%',
                  paddingBottom: '100%',
                  position: 'relative'
                }}
              >
                <label 
                  htmlFor="image-upload-add"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: '2px dashed #9ca3af',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#f9fafb'
                  }}
                  className="hover:border-blue-500 hover:bg-blue-50"
                >
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload-add"
                    disabled={uploading}
                  />
                  
                  <PlusIcon style={{ width: '24px', height: '24px', color: '#6b7280', marginBottom: '4px' }} />
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Add</span>
                </label>
              </div>
            )}
          </div>
          
          {/* Summary */}
          <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
            <span>{images.length}/{maxImages} images</span>
            <span className="text-xs">
              Total: {formatFileSize(images.reduce((total, img) => total + (img.size || 0), 0))}
            </span>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {images.length === 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-3">
              {uploading ? (
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <PhotoIcon className="w-6 h-6 text-gray-400" />
                </div>
              )}
              
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-700">
                  {uploading ? 'Processing...' : 'Upload Images'}
                </div>
                <div className="text-xs text-gray-500">
                  Click to browse or drag & drop
                </div>
                <div className="text-xs text-gray-400">
                  JPG, PNG, GIF, WebP up to 5MB (max {maxImages})
                </div>
              </div>
            </div>
          </label>
        </div>
      )}

      {/* Quick Actions */}
      {images.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {!isMaxReached && (
              <label 
                htmlFor="image-upload-add"
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add More</span>
              </label>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Remove all ${images.length} images?`)) {
                setImageErrors({});
                images.forEach((_, index) => onRemove(index));
              }
            }}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-blue-700">Processing images...</span>
          </div>
        </div>
      )}

      {/* Test Display - để debug */}
      {process.env.NODE_ENV === 'development' && images.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-bold text-sm mb-2">Test Display (Raw Image):</h4>
          {images.map((img, idx) => (
            <div key={idx} className="mb-2">
              <div className="text-xs mb-1">Image {idx + 1}: {img.name}</div>
              <img 
                src={img.url} 
                alt="test" 
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  border: '1px solid red',
                  objectFit: 'cover'
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;