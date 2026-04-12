import React, { useState } from 'react';
import { XMarkIcon, EyeIcon, ArrowsPointingOutIcon, PencilIcon } from '@heroicons/react/24/outline';

const PostMedia = ({ images, onRemoveImage, onEditImage, maxImages = 4 }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  if (!images || images.length === 0) return null;

  const getImageLayout = (count) => {
    switch (count) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-2';
      case 4:
        return 'grid-cols-2';
      default:
        return 'grid-cols-2';
    }
  };

  const getImageClass = (index, total) => {
    if (total === 3 && index === 0) {
      return 'col-span-2 row-span-1';
    }
    return '';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleImagePreview = (image, index) => {
    setSelectedImage({ ...image, index });
    setShowPreview(true);
  };

  const handleImageEdit = (image, index) => {
    // You can implement image editing features here
    const newName = prompt('Enter new name for image:', image.name || `Image ${index + 1}`);
    if (newName && onEditImage) {
      onEditImage(index, { ...image, name: newName });
    }
  };

  return (
    <>
      <div className="mb-4">
        {/* Images Grid */}
        <div className={`grid ${getImageLayout(images.length)} gap-2 mb-3`}>
          {images.slice(0, maxImages).map((image, index) => (
            <div 
              key={image.id || index} 
              className={`relative group overflow-hidden rounded-lg border border-gray-200 ${getImageClass(index, images.length)}`}
            >
              {/* Image */}
              <div className="relative bg-gray-100">
                <img
                  src={image.url || image}
                  alt={image.name || `Image ${index + 1}`}
                  className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23666">Image Error</text></svg>';
                    e.target.className = 'w-full h-48 object-cover bg-gray-200 flex items-center justify-center';
                  }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200" />
                
                {/* Action Buttons */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex items-center space-x-2">
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => handleImagePreview(image, index)}
                      className="p-2 bg-white bg-opacity-90 text-gray-700 rounded-full hover:bg-opacity-100 transition-all shadow-lg"
                      title="Preview"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    
                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleImageEdit(image, index)}
                      className="p-2 bg-white bg-opacity-90 text-gray-700 rounded-full hover:bg-opacity-100 transition-all shadow-lg"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    
                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      className="p-2 bg-red-500 bg-opacity-90 text-white rounded-full hover:bg-opacity-100 transition-all shadow-lg"
                      title="Remove"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Image Info Badge */}
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded-full">
                  {index + 1}/{images.length}
                </div>

                {/* File Size Badge */}
                {image.size && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded-full">
                    {formatFileSize(image.size)}
                  </div>
                )}
              </div>

              {/* Image Details */}
              <div className="p-2 bg-white border-t border-gray-200">
                <div className="text-xs text-gray-600 truncate" title={image.name || `Image ${index + 1}`}>
                  {image.name || `Image ${index + 1}`}
                </div>
                {image.type && (
                  <div className="text-xs text-gray-400">
                    {image.type.split('/')[1].toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Show remaining count if more than max display */}
          {images.length > maxImages && (
            <div className="relative bg-gray-100 border border-gray-200 rounded-lg h-48 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  +{images.length - maxImages}
                </div>
                <div className="text-sm text-gray-500">more images</div>
              </div>
            </div>
          )}
        </div>

        {/* Media Summary */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-3">
          <span className="font-medium">
            {images.length} image{images.length > 1 ? 's' : ''} selected
          </span>
          <span className="text-xs">
            Total size: {formatFileSize(images.reduce((total, img) => total + (img.size || 0), 0))}
          </span>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showPreview && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowPreview(false)}>
          <div className="relative max-w-4xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-6 right-6 p-2 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-40 transition-all z-10"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            {/* Image */}
            <img
              src={selectedImage.url || selectedImage}
              alt={selectedImage.name || `Image ${selectedImage.index + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {/* Image Info */}
            <div className="absolute bottom-6 left-6 right-6 bg-black bg-opacity-60 text-white p-4 rounded-lg">
              <div className="font-medium">{selectedImage.name || `Image ${selectedImage.index + 1}`}</div>
              <div className="text-sm text-gray-300">
                {selectedImage.type && `${selectedImage.type.split('/')[1].toUpperCase()} • `}
                {selectedImage.size && formatFileSize(selectedImage.size)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostMedia;