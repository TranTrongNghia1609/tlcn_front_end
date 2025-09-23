import React, { useState } from 'react';
import CommentHeader from './CommentHeader';
import CommentContent from './CommentContent';
import CommentActions from './CommentActions';
import CommentForm from './CommentForm';
import { useUser } from '../../../context/UserContext';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const CommentItem = ({
  comment,
  isReply = false,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onCreateReply,
  level = 0,
  hideReplies = true
}) => {
  const { user } = useUser();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(!hideReplies);

  // Safety check
  if (!comment || typeof comment !== 'object') {
    return null;
  }

  // Skip buffer objects
  if (comment.buffer && !comment.content) {
    return null;
  }

  // Lọc ra replies hợp lệ và bỏ qua buffer objects
  const getValidReplies = (replies) => {
    if (!Array.isArray(replies)) return [];
    
    return replies.filter(reply => {
      return reply && 
             typeof reply === 'object' && 
             reply._id && 
             !reply.buffer &&
             reply.content; // Đảm bảo có content
    });
  };

  // Tính toán số lượng replies đúng
  const calculateTotalReplies = (replies) => {
    if (!Array.isArray(replies)) return 0;
    
    return replies.reduce((count, reply) => {
      if (!reply || reply.buffer || !reply.content) return count;
      
      // Đếm cả reply con nếu có
      const validNestedReplies = reply.replies ? getValidReplies(reply.replies) : [];
      const nestedCount = validNestedReplies.length;
      
      return count + 1 + nestedCount;
    }, 0);
  };

  const validReplies = getValidReplies(comment.replies);
  const hasReplies = validReplies.length > 0;
  const totalRepliesCount = calculateTotalReplies(comment.replies);

  const handleReply = () => {
    setIsReplying(prev => !prev);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsReplying(false);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSubmitReply = async (content) => {
    if (onCreateReply) {
      await onCreateReply(content, comment._id);
      setIsReplying(false);
      setShowReplies(true);
    }
  };

  const handleSubmitEdit = async (content) => {
    if (onEditComment) {
      await onEditComment(comment._id, content);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (onDeleteComment) {
      onDeleteComment(comment._id);
    }
  };

  const handleLike = () => {
    if (onLikeComment) {
      onLikeComment(comment._id);
    }
  };

  const toggleReplies = () => {
    setShowReplies(prev => !prev);
  };

  // Logic hiển thị và indent
  const MAX_LEVEL = 2; // Level tối đa là 2
  
  // Cấp hiện tại hiển thị (không vượt quá MAX_LEVEL)
  const displayLevel = Math.min(level, MAX_LEVEL);
  
  const nextLevel = level >= MAX_LEVEL ? MAX_LEVEL : level + 1;
  
  // Toggle button chỉ hiển thị ở level 0 (comment gốc)
  const shouldShowToggleButton = hasReplies && level === 0;
  
  // Hiển thị avatar ở tất cả các cấp
  const showAvatar = true;

  return (
    <div className={`comment-item mb-3 ${isReply ? `ml-${Math.min(displayLevel * 4, 8)}` : ''}`}>
      <div className="flex items-start">
        {/* Avatar */}
        {showAvatar && (
          <div className="flex-shrink-0 mr-3">
            <img
              src={comment.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.userName || 'User')}&background=2563eb&color=fff`}
              alt={comment.author?.userName || 'User'}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        )}
        
        {/* Content container */}
        <div className="flex-grow">
          <div className={`rounded-lg ${isReply ? 'bg-gray-50' : 'bg-white'} p-3`}>
            <CommentHeader
              author={comment.author}
              createdAt={comment.createdAt}
              isEdited={comment.isEdited}
              hideAvatar={true}
            />

            <CommentContent
              content={comment.content}
              isEditing={isEditing}
              onSubmit={handleSubmitEdit}
              onCancel={handleCancelEdit}
            />

            <CommentActions
              comment={comment}
              isLiked={comment.isLiked}
              isReply={isReply}
              user={user}
              onLike={handleLike}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleReplies={shouldShowToggleButton ? toggleReplies : undefined}
              showReplies={showReplies}
              showReplyForm={isReplying}
              canReply={true} 
              level={displayLevel}
            />

            {isReplying && (
              <div className="mt-3">
                <CommentForm
                  onSubmit={handleSubmitReply}
                  onCancel={handleCancelReply}
                  placeholder="Write a reply..."
                  isReply={true}
                  size="small"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toggle button */}
      {shouldShowToggleButton && (
        <div className="mt-2 mb-2 ml-2">
          <button
            onClick={toggleReplies}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors hover:underline"
          >
            {showReplies ? (
              <>
                <ChevronUpIcon className="w-4 h-4 mr-1" />
                Hide {totalRepliesCount} {totalRepliesCount === 1 ? 'reply' : 'replies'}
              </>
            ) : (
              <>
                <ChevronDownIcon className="w-4 h-4 mr-1" />
                View {totalRepliesCount} {totalRepliesCount === 1 ? 'reply' : 'replies'}
              </>
            )}
          </button>
        </div>
      )}

      {/* Replies container */}
      {hasReplies && (
        <div 
          className={`transition-all duration-300 ml-10 ${
            showReplies 
              ? 'max-h-[5000px] opacity-100 mt-2' 
              : 'max-h-0 opacity-0 overflow-hidden mt-0'
          }`}
        >
          {showReplies && validReplies.map((reply) => {
            // Thực hiện đệ quy để hiển thị replies
            return (
              <CommentItem
                key={reply._id}
                comment={reply}
                isReply={true}
                onEditComment={onEditComment}
                onDeleteComment={onDeleteComment}
                onLikeComment={onLikeComment}
                onCreateReply={onCreateReply}
                level={nextLevel}
                hideReplies={false}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentItem;