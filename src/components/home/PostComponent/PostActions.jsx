import React, { useState } from 'react';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon
} from '@heroicons/react/24/solid';
import { useUser } from '../../../context/UserContext';

const PostActions = ({ 
  post, 
  onLike, 
  onToggleComments, 
  onBookmark, 
  onShare,
  showComments,
  isLiking 
}) => {
  const { user } = useUser();
  const [isAnimating, setIsAnimating] = useState(false);

  const isLiked = Boolean(post.isLiked);
  const likesCount = post.likesCount || 0;
  
  const isBookmarked = post.isBookmarked || 
                       (Array.isArray(post.bookmarks) && post.bookmarks.includes(user?._id)) ||
                       false;

  const handleLike = async () => {
    if (!user || isLiking) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    
    try {
      await onLike();
    } catch (error) {
      console.error('PostActions like error:', error);
    }
  };

  return (
    <div className="px-6 py-3 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={!user || isLiking}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              isLiked
                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            } ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
              isLiking ? 'animate-pulse' : ''
            } hover:scale-105`}
            title={!user ? 'Login to like posts' : (isLiked ? 'Unlike this post' : 'Like this post')}
          >
            <div className="relative">
              {isLiked ? (
                <>
                  <HeartSolidIcon className={`w-5 h-5 transition-transform duration-300 ${
                    isAnimating ? 'scale-125 rotate-12' : ''
                  }`} />
                  
                  {isAnimating && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute animate-ping">
                        <HeartSolidIcon className="w-4 h-4 text-red-400 animate-bounce" />
                      </div>
                      <div className="absolute -top-1 -right-1 animate-bounce delay-100">
                        <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <HeartIcon className={`w-5 h-5 transition-transform duration-200 ${
                  isAnimating ? 'scale-110' : ''
                }`} />
              )}
              
              {isLiking && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            <span className={`font-medium transition-all duration-200 ${
              isAnimating ? 'scale-110' : ''
            } ${isLiking ? 'opacity-70' : ''}`}>
              {likesCount}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => {
              if (onToggleComments) {
                onToggleComments();
              } else {
                console.error('❌ onToggleComments is undefined!');
              }
            }}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              showComments 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            } hover:scale-105`}
          >
            <ChatBubbleLeftIcon className="w-5 h-5" />
            <span className="font-medium">{post.commentsCount || 0}</span>
          </button>  
        </div>

        {/* Bookmark Button */}
        {user && (
          <button
            onClick={onBookmark}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isBookmarked
                ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
            } hover:scale-105`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this post'}
          >
            {isBookmarked ? (
              <BookmarkSolidIcon className="w-5 h-5" />
            ) : (
              <BookmarkIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default PostActions;