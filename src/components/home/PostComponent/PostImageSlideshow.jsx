import React, { useState, useCallback, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const PostImageSlideshow = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState({});
  const [slideDirection, setSlideDirection] = useState('right');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Parse images từ Object sang string URL
  const imageUrls = useMemo(() => {
    if (!images || images.length === 0) return [];
    
    return images.map((img) => {
      if (typeof img === 'string') return img;
      
      if (typeof img === 'object' && img !== null) {
        return img.url || img.publicId || img.path || img.src || '';
      }
      
      return '';
    }).filter(url => url);
  }, [images]);

  if (!imageUrls || imageUrls.length === 0) {
    return null;
  }

  const hasMultipleImages = imageUrls.length > 1;

  const goToNext = useCallback((e) => {
    if (e) e.stopPropagation();
    if (isTransitioning) return;
    
    setSlideDirection('left');
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
      setIsTransitioning(false);
    }, 300);
  }, [imageUrls.length, isTransitioning]);

  const goToPrevious = useCallback((e) => {
    if (e) e.stopPropagation();
    if (isTransitioning) return;
    
    setSlideDirection('right');
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
      setIsTransitioning(false);
    }, 300);
  }, [imageUrls.length, isTransitioning]);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === currentIndex) return;
    
    setSlideDirection(index > currentIndex ? 'left' : 'right');
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  }, [currentIndex, isTransitioning]);

  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious(e);
    } else if (e.key === 'ArrowRight') {
      goToNext(e);
    } else if (e.key === 'Escape') {
      setIsZoomed(false);
    }
  }, [goToNext, goToPrevious]);

  const handleImageError = useCallback((index) => {
    setImageError(prev => ({ ...prev, [index]: true }));
    console.error(`Failed to load image at index ${index}:`, imageUrls[index]);
  }, [imageUrls]);

  const currentImageUrl = imageUrls[currentIndex];

  // Animation classes
  const getAnimationClass = () => {
    if (!isTransitioning) return 'translate-x-0 opacity-100';
    
    if (slideDirection === 'left') {
      return '-translate-x-full opacity-0';
    } else {
      return 'translate-x-full opacity-0';
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden shadow-sm">
      {/* Fixed Container - Khung cố định */}
      <div className="relative w-full" style={{ height: '500px' }}>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {imageError[currentIndex] ? (
            // Error placeholder
            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Image not available</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Image with animation */}
              <img
                key={currentIndex}
                src={currentImageUrl}
                alt={`Post image ${currentIndex + 1}`}
                className={`max-w-full max-h-full object-contain rounded transition-all duration-300 ease-out ${
                  isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in scale-100'
                } ${getAnimationClass()}`}
                onClick={toggleZoom}
                onKeyDown={handleKeyDown}
                onError={() => handleImageError(currentIndex)}
                tabIndex={0}
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {hasMultipleImages && (
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              disabled={isTransitioning}
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-10 ${
                isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              disabled={isTransitioning}
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 z-10 ${
                isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-800" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {hasMultipleImages && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/70 text-white text-sm font-medium rounded-full backdrop-blur-sm z-10 shadow-lg">
            {currentIndex + 1} / {imageUrls.length}
          </div>
        )}

        {/* Dot Indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-10">
            {imageUrls.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-blue-500'
                    : 'w-2 h-2 bg-white/70 hover:bg-white hover:scale-125'
                } ${isTransitioning ? 'cursor-not-allowed' : ''} shadow-sm`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Loading indicator during transition */}
        {isTransitioning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 z-20 pointer-events-none">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Mobile Swipe Hint */}
      {hasMultipleImages && (
        <div className="px-4 py-2 text-center text-xs text-gray-500 bg-gray-50/80 md:hidden">
          Swipe or use arrows to navigate
        </div>
      )}
    </div>
  );
};

export default PostImageSlideshow;