import React, { useState, useEffect } from 'react';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useUser } from '../../../context/UserContext';

const CommentActions = ({ 
  comment, 
  isLiked = false, 
  isReply = false,
  user = null,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onToggleReplies, // For toggle replies
  showReplies = false, // Current state
  showReplyForm = false,
  canReply = true,
  level = 0
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [optimisticLikeState, setOptimisticLikeState] = useState(isLiked);
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(comment?.likesCount || 0);

  useEffect(() => {
    setOptimisticLikeState(isLiked);
  }, [isLiked]);

  useEffect(() => {
    if (comment?.likesCount !== undefined) {
      setOptimisticLikeCount(comment.likesCount);
    }
  }, [comment?.likesCount]);

  if (!comment) {
    return null;
  }

  // Basic date formatting
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      
      // Check for invalid date
      if (isNaN(date.getTime())) {
        return '';
      }
      
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return '';
    }
  };

  const handleLike = async () => {
    if (!user || !onLike) return;
    
    const newLikedState = !optimisticLikeState;
    const newLikesCount = newLikedState 
      ? optimisticLikeCount + 1 
      : Math.max(0, optimisticLikeCount - 1);

    setOptimisticLikeState(newLikedState);
    setOptimisticLikeCount(newLikesCount);
    setIsAnimating(true);

    try {
      await onLike();
    } catch (error) {
      // Revert on error
      setOptimisticLikeState(!newLikedState);
      setOptimisticLikeCount(optimisticLikeCount);
    }
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  // Only show toggle for replies if there are replies
  const hasReplies = Array.isArray(comment.replies) && comment.replies.length > 0;
  
  // Only show toggle button at appropriate levels
  const shouldShowToggle = hasReplies && onToggleReplies && (level === 0 || level === 1);

  const isAuthor = user && comment.author && user._id === comment.author._id;

  return (
    <div className="flex items-center space-x-3 mt-2 text-xs">
      {/* Like button */}
      <button
        onClick={handleLike}
        disabled={!user}
        className={`group flex items-center space-x-1 transition-all duration-200 ${
          !user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="relative flex items-center justify-center">
          {optimisticLikeState ? (
            <HeartSolidIcon 
              className={`w-4 h-4 text-red-500 transition-all duration-300 ${
                isAnimating ? 'scale-125' : 'scale-100'
              }`} 
            />
          ) : (
            <HeartIcon 
              className="w-4 h-4 text-gray-500 group-hover:text-red-400" 
            />
          )}
        </div>
        
        <span className={`${
          optimisticLikeState ? 'text-red-500 font-medium' : 'text-gray-500'
        }`}>
          {optimisticLikeCount}
        </span>
      </button>

      {/* Reply button */}
      {user && canReply && onReply && (
        <button
          onClick={onReply}
          className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
        >
          <ChatBubbleLeftIcon className="w-4 h-4" />
          <span>{showReplyForm ? 'Cancel' : 'Reply'}</span>
        </button>
      )}

      {/* Edit & Delete buttons for author */}
      {isAuthor && (
        <>
          {onEdit && (
            <button 
              onClick={onEdit}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
            >
              <PencilIcon className="w-3 h-3" />
              <span>Edit</span>
            </button>
          )}
          
          {onDelete && (
            <button 
              onClick={onDelete}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-600"
            >
              <TrashIcon className="w-3 h-3" />
              <span>Delete</span>
            </button>
          )}
        </>
      )}

      {/* Timestamp */}
      <span className="text-gray-400">
        {formatDate(comment.createdAt)}
      </span>     
    </div>
  );
};

export default CommentActions;