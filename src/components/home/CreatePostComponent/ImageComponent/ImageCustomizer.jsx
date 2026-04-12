import React, { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
const ImageCustomizer = ({ image, onClose, onEdit }) => {
   if (!image) return null;
  const [editData, setEditData] = useState({
    caption: image?.caption || image?.name || '',
    altText: image?.altText || `Image ${index + 1}`,
    quality: image?.quality || 85,
    resize: image?.resize || { width: '', height: '', maintainAspectRatio: true },
    effects: image?.effects || {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0
    },
    crop: image?.crop || { x: 0, y: 0, width: 100, height: 100 }
  });

  if (!image) return null;

  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };
  const applyImageFilters = (image) => {
    if (!image.effects) return {};

    const hasCustomEffects =
      image.effects.brightness !== 100 ||
      image.effects.contrast !== 100 ||
      image.effects.saturation !== 100 ||
      image.effects.blur !== 0;

    if (!hasCustomEffects) return {};

    return {
      filter: `
        brightness(${image.effects.brightness || 100}%) 
        contrast(${image.effects.contrast || 100}%) 
        saturate(${image.effects.saturation || 100}%) 
        blur(${image.effects.blur || 0}px)
      `.replace(/\s+/g, ' ').trim()
    };
  };

  

  return (
    <div className="bg-white rounded-lg overflow-hidden h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Image Preview</h3>
          <div className="text-sm text-gray-500">
            {image.caption || image.name}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Edit Button */}
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex h-[calc(80vh-80px)]">
        {/* Image Display Section */}
        <div className="flex-1 p-6 bg-gray-50 border-r">
          <div className="h-full flex items-center justify-center">
            <div className="relative max-w-full max-h-full">
              <img
                src={image.preview}
                alt={image.altText || image.name}
                style={applyImageFilters(image)}
                className="max-w-full max-h-[60vh] object-contain mx-auto rounded-lg shadow-lg border"
              />
              
              {/* Preview Label */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-3 py-2 rounded">
                Preview Mode
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="w-80 flex flex-col bg-white">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Image Information</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                      {image.caption || 'No caption'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                      {image.altText || 'No alt text'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">File Details</label>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium">{formatFileSize(image.size)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quality:</span>
                        <span className="font-medium">{image.quality || 85}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{image.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Effects Information */}
              {image.effects && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Applied Effects</h4>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Brightness:</span>
                        <div className="font-medium">{image.effects.brightness}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Contrast:</span>
                        <div className="font-medium">{image.effects.contrast}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Saturation:</span>
                        <div className="font-medium">{image.effects.saturation}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Blur:</span>
                        <div className="font-medium">{image.effects.blur}px</div>
                      </div>
                    </div>

                    {/* Effects Status */}
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-blue-700">
                          {(image.effects.brightness !== 100 || 
                            image.effects.contrast !== 100 || 
                            image.effects.saturation !== 100 || 
                            image.effects.blur !== 0) 
                            ? 'Custom effects applied' 
                            : 'No effects applied'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Resize Information */}
              {image.resize && (image.resize.width || image.resize.height) && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Resize Settings</h4>
                  
                  <div className="space-y-2 text-sm">
                    {image.resize.width && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Width:</span>
                        <span className="font-medium">{image.resize.width}px</span>
                      </div>
                    )}
                    {image.resize.height && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Height:</span>
                        <span className="font-medium">{image.resize.height}px</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Maintain Ratio:</span>
                      <span className="font-medium">
                        {image.resize.maintainAspectRatio ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t bg-gray-50 px-6 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Post
              </button>
              
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Image
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCustomizer;