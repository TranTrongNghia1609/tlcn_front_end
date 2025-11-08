import React, { useState, useEffect } from 'react';
import CommentHeader from './CommentHeader';
import CommentContent from './CommentContent';
import CommentActions from './CommentActions';
import CommentForm from './CommentForm';
import { useUser } from '../../../context/UserContext';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { commentService } from '../../../services/commentService';

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
  
  // State cho pagination
  const [replies, setReplies] = useState(comment.replies || []);
  // Backend đã tính sẵn totalReplies đệ quy
  const [totalReplies, setTotalReplies] = useState(comment.totalReplies || 0);
  const [loadedRepliesCount, setLoadedRepliesCount] = useState(comment.loadedRepliesCount || 0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreReplies, setHasMoreReplies] = useState(comment.hasMoreReplies || false);

  // Initialize state from comment prop
  useEffect(() => {
    if (comment.replies) {
      setReplies(comment.replies);
    }
    if (comment.totalReplies !== undefined) {
      setTotalReplies(comment.totalReplies);
    }
    if (comment.loadedRepliesCount !== undefined) {
      setLoadedRepliesCount(comment.loadedRepliesCount);
    }
    if (comment.hasMoreReplies !== undefined) {
      setHasMoreReplies(comment.hasMoreReplies);
    }
  }, [comment]);

  if (!comment || typeof comment !== 'object' || comment.buffer || !comment.content) {
    return null;
  }

  const getValidReplies = (repliesList) => {
    if (!Array.isArray(repliesList)) return [];
    
    return repliesList.filter(reply => {
      return reply && 
             typeof reply === 'object' && 
             reply._id && 
             !reply.buffer &&
             reply.content;
    });
  };

  const validReplies = getValidReplies(replies);
  const hasRepliesData = validReplies.length > 0 || totalReplies > 0;
  const remainingRepliesCount = totalReplies - loadedRepliesCount;

  const handleLoadMoreReplies = async () => {
    if (isLoadingMore || !hasMoreReplies) return;
    
    setIsLoadingMore(true);
    try {
      const response = await commentService.loadMoreReplies(
        comment._id,
        loadedRepliesCount,
        5,
        true
      );

      const { replies: newReplies, pagination } = response.data;
      
      setReplies(prev => [...prev, ...newReplies]);
      setLoadedRepliesCount(pagination.currentSkip + pagination.loadedCount);
      setTotalReplies(pagination.totalReplies); 
      setHasMoreReplies(pagination.hasMore);
      
    } catch (error) {
      console.error('Error loading more replies:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleShowAllReplies = async () => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const response = await commentService.loadMoreReplies(
        comment._id,
        loadedRepliesCount,
        remainingRepliesCount,
        true
      );

      const { replies: newReplies, pagination } = response.data;
      
      setReplies(prev => [...prev, ...newReplies]);
      setLoadedRepliesCount(pagination.totalReplies);
      setHasMoreReplies(false);
      
    } catch (error) {
      console.error('Error loading all replies:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleCollapseReplies = () => {
    const initialReplies = comment.replies?.slice(0, 3) || [];
    setReplies(initialReplies);
    setLoadedRepliesCount(initialReplies.length);
    setHasMoreReplies(totalReplies > initialReplies.length);
  };

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
      
      try {
        const response = await commentService.loadMoreReplies(
          comment._id,
          0,
          3,
          true
        );
        
        setReplies(response.data.replies);
        setTotalReplies(response.data.pagination.totalReplies);
        setLoadedRepliesCount(response.data.replies.length);
        setHasMoreReplies(response.data.pagination.hasMore);
      } catch (error) {
        console.error('Error refreshing replies:', error);
      }
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

  const MAX_LEVEL = 2;
  const displayLevel = Math.min(level, MAX_LEVEL);
  const nextLevel = level >= MAX_LEVEL ? MAX_LEVEL : level + 1;
  const shouldShowToggleButton = hasRepliesData && level === 0;
  const showAvatar = true;

  const mentionDisplayName = comment.author?.fullName || comment.author?.userName || 'User';

  return (
    <div className={`comment-item mb-3 ${isReply ? `ml-${Math.min(displayLevel * 4, 8)}` : ''}`}>
      <div className="flex items-start">
        {showAvatar && (
          <div className="flex-shrink-0 mr-3">
            <img
              src={comment.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentionDisplayName)}&background=2563eb&color=fff`}
              alt={mentionDisplayName}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        )}
        
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
                  placeholder={`Reply to ${mentionDisplayName}...`}
                  isReply={true}
                  size="small"
                  user={user}
                  mentionUser={comment.author}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toggle Button - Hiển thị totalReplies từ Backend */}
      {shouldShowToggleButton && (
        <div className="mt-2 mb-2 ml-2">
          <button
            onClick={toggleReplies}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors hover:underline"
          >
            {showReplies ? (
              <>
                <ChevronUpIcon className="w-4 h-4 mr-1" />
                Hide {totalReplies} {totalReplies === 1 ? 'reply' : 'replies'}
              </>
            ) : (
              <>
                <ChevronDownIcon className="w-4 h-4 mr-1" />
                View {totalReplies} {totalReplies === 1 ? 'reply' : 'replies'}
              </>
            )}
          </button>
        </div>
      )}

      {hasRepliesData && (
        <div 
          className={`transition-all duration-300 ml-10 ${
            showReplies 
              ? 'max-h-[5000px] opacity-100 mt-2' 
              : 'max-h-0 opacity-0 overflow-hidden mt-0'
          }`}
        >
          {showReplies && (
            <>
              {validReplies.map((reply) => (
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
              ))}

              {hasMoreReplies && (
                <div className="mt-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    
                    <button
                      onClick={handleLoadMoreReplies}
                      disabled={isLoadingMore}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors"
                    >
                      {isLoadingMore ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </span>
                      ) : (
                        `View ${Math.min(remainingRepliesCount, 5)} more ${remainingRepliesCount === 1 ? 'reply' : 'replies'}`
                      )}
                    </button>

                    {remainingRepliesCount > 5 && (
                      <>
                        <span className="text-gray-400">|</span>
                        <button
                          onClick={handleShowAllReplies}
                          disabled={isLoadingMore}
                          className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors"
                        >
                          View all ({totalReplies})
                        </button>
                      </>
                    )}
                    
                    <div className="h-px bg-gray-300 flex-1"></div>
                  </div>
                </div>
              )}

              {!hasMoreReplies && loadedRepliesCount > 3 && (
                <div className="mt-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <button
                      onClick={handleCollapseReplies}
                      className="text-sm font-semibold text-gray-600 hover:text-gray-800 whitespace-nowrap transition-colors"
                    >
                      Collapse replies
                    </button>
                    <div className="h-px bg-gray-300 flex-1"></div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;