import React, { useState, useRef } from 'react';
import {
  PhotoIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const ImageUpload = ({
  images,
  onUpload,
  onRemove,
  onEdit,
  onFilesChange,
  onPreview,
  onCustomize,
  maxImages = 4,
  disabled = false,
  isUploading = false
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFilesChange(files);
    }
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      onFilesChange(files);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getTotalSize = () => {
    return images.reduce((total, img) => total + (img.size || 0), 0);
  };

  const applyImageFilters = (image) => {
    if (!image?.effects) return {};

    const effects = image.effects;

    const hasCustomEffects =
      effects.brightness !== 100 ||
      effects.contrast !== 100 ||
      effects.saturation !== 100 ||
      effects.blur !== 0;

    if (!hasCustomEffects) {
      return {};
    }

    return {
      filter: `brightness(${effects.brightness}%) contrast(${effects.contrast}%) saturate(${effects.saturation}%) blur(${effects.blur}px)`
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Images</h4>
        {images.length > 0 && (
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>{images.length}/{maxImages} images</span>
            <span>•</span>
            <span>Total: {formatFileSize(getTotalSize())}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <div key={image.id || index} className="relative group">
            <div className="border-2 border-dashed border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-2">
              <img
                src={image.preview}
                alt={image.altText || image.name}
                style={{
                  ...applyImageFilters(image),
                  maxWidth: '100%',    
                  height: 'auto',      
                  display: 'block',
                  margin: '0 auto'     
                }}
                onLoad={() => console.log('✅ Auto-size image loaded:', image.name)}
                onError={(e) => console.error('❌ Image error:', e, image)}
              />
            </div>

            {/* Controls overlay */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex space-x-1">
                <button
                  onClick={() => onCustomize(index)}
                  className="p-1.5 bg-white text-gray-700 rounded-full hover:bg-gray-100 shadow-lg transition-all"
                  title="Customize"
                >
                  <AdjustmentsHorizontalIcon className="w-3 h-3" />
                </button>

                <button
                  onClick={() => onPreview(index)}
                  className="p-1.5 bg-white text-gray-700 rounded-full hover:bg-gray-100 shadow-lg transition-all"
                  title="Preview"
                >
                  <EyeIcon className="w-3 h-3" />
                </button>

                <button
                  onClick={() => onRemove(index)}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all"
                  title="Remove"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Image info */}
            <div className="mt-2 text-xs text-gray-600">
              <div className="truncate font-medium">{image.caption || image.name}</div>
              <div className="flex justify-between items-center mt-1">
                <span>{formatFileSize(image.size)}</span>
                <div className="flex items-center space-x-1">
                  <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                    {image.quality || 85}%
                  </span>
                  {(image.effects && (
                    image.effects.brightness !== 100 ||
                    image.effects.contrast !== 100 ||
                    image.effects.saturation !== 100 ||
                    image.effects.blur !== 0
                  )) && (
                      <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded">✓</span>
                    )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {images.length < maxImages && (
          <div className="relative">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
              style={{
                width: '100%',
                height: '200px' 
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="h-full flex flex-col items-center justify-center">
                <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500 text-center px-2">
                  {images.length === 0 ? 'Add Images' : 'Add More'}
                </span>
                <span className="text-xs text-gray-400 text-center px-2 mt-1">
                  Click or drag & drop<br />
                  JPG, PNG, GIF, WebP up to 10MB (max {maxImages})
                </span>
              </div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {
          isUploading && (
            <div className="text-center py-4">
              <div className="inline-flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Uploading images...</span>
              </div>
            </div>
          )
        }
      </div >
    </div>
  );
};

export default ImageUpload;