import React from 'react';
import PostImageSlideshow from './PostImageSlideshow';

const PostContent = ({ post, isExpanded = false, onToggleExpanded }) => {
  if (!post) return null;

  const { content, images } = post;
  const MAX_LENGTH = 200;
  const shouldTruncate = !isExpanded && content && content.length > MAX_LENGTH;
  const displayContent = shouldTruncate 
    ? `${content.substring(0, MAX_LENGTH)}...` 
    : content;

  return (
    <div className="px-6">
      {/* Images Slideshow */}
      {images && images.length > 0 && (
        <div className="mb-4 -mx-6">
          <PostImageSlideshow images={images} />
        </div>
      )}

      {/* Content */}
      {content && (
        <div className="space-y-2">
          <p className="text-gray-800 whitespace-pre-wrap break-words">
            {displayContent}
          </p>
          
          {content.length > MAX_LENGTH && (
            <button
              onClick={onToggleExpanded}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PostContent;