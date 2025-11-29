import React from 'react';
import {
  HeartIcon as HeartOutline,
  ChatBubbleLeftIcon,
  BookmarkIcon as BookmarkOutline,
  ShareIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolid,
  BookmarkIcon as BookmarkSolid
} from '@heroicons/react/24/solid';
import { useUser } from '../../../context/UserContext';

const PostActions = ({
  post,
  onLike,
  onToggleComments,
  onBookmark,
  onShare,
  showComments = false,
  isLiking = false,
  hideCommentButton = false
}) => {
  const { user } = useUser();

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (user) {
      onLike();
    }
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    onToggleComments();
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    if (user) {
      onBookmark();
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    onShare();
  };

  return (
    <div className="border-t border-gray-100">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLikeClick}
            disabled={isLiking || !user}
            className={`flex items-center space-x-2 transition-colors ${
              post.isLiked
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-500 hover:text-red-500'
            } ${(!user || isLiking) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {post.isLiked ? (
              <HeartSolid className="w-5 h-5" />
            ) : (
              <HeartOutline className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">
              {post.likesCount || 0}
            </span>
          </button>

          {!hideCommentButton && (
            <button
              onClick={handleCommentClick}
              className={`flex items-center space-x-2 transition-colors ${
                showComments
                  ? 'text-blue-500 hover:text-blue-600'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              <ChatBubbleLeftIcon className="w-5 h-5" />
              <span className="text-sm font-medium">
                {post.commentsCount || 0}
              </span>
            </button>
          )}

          {hideCommentButton && (
            <div className="flex items-center space-x-2 text-gray-500">
              <ChatBubbleLeftIcon className="w-5 h-5" />
              <span className="text-sm font-medium">
                {post.commentsCount || 0}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleBookmarkClick}
            disabled={!user}
            className={`transition-colors ${
              post.isBookmarked
                ? 'text-blue-500 hover:text-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {post.isBookmarked ? (
              <BookmarkSolid className="w-5 h-5" />
            ) : (
              <BookmarkOutline className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={handleShareClick}
            className="text-gray-500 hover:text-blue-500 transition-colors"
          >
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostActions;