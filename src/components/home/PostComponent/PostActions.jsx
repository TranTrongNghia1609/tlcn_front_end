import React from 'react';
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
  
  const isLiked = post.likes?.includes(user?._id);
  const isBookmarked = post.bookmarks?.includes(user?._id);

  return (
    <div className="px-6 py-3 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Like */}
          <button
            onClick={onLike}
            disabled={!user || isLiking}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isLiked
                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLiked ? (
              <HeartSolidIcon className="w-5 h-5" />
            ) : (
              <HeartIcon className="w-5 h-5" />
            )}
            <span className="font-medium">{post.likesCount || 0}</span>
          </button>

          {/* Comment */}
          <button
            onClick={onToggleComments}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              showComments 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <ChatBubbleLeftIcon className="w-5 h-5" />
            <span className="font-medium">{post.commentsCount || 0}</span>
          </button>

          {/* Share */}
          <button
            onClick={onShare}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
          >
            <ShareIcon className="w-5 h-5" />
            <span className="font-medium">Share</span>
          </button>
        </div>

        {/* Bookmark */}
        {user && (
          <button
            onClick={onBookmark}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
            }`}
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