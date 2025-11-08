import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../../context/UserContext';
import { useComment } from '../../context/CommentContext';
import {
  CommentForm,
  CommentList,
  CommentStats,
  ErrorDisplay
} from './CommentComponent';

const CommentSection = ({ postId, hideCommentForm = false }) => {
  const { user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('oldest');
  const [localComments, setLocalComments] = useState([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);
  const isOptimisticUpdateRef = useRef(false);
  const {
    getPostComments: getPostCommentsData,
    loadPostComments,
    createComment,
    updateComment,
    deleteComment,
    toggleLikeComment,
    clearError,
    loading,
    error
  } = useComment();

  const { comments: contextComments, pagination } = getPostCommentsData(postId);

  // Normalize comment data - KHÔNG dùng useCallback vì hàm đệ quy
  const normalizeComment = (comment) => {
    if (!comment) return null;
    const unifiedId = comment._id || comment.id;
    const normalized = {
      ...comment,
      _id: unifiedId,
      id: unifiedId,
    };
    if (normalized.replies && Array.isArray(normalized.replies)) {
      normalized.replies = normalized.replies.map(normalizeComment).filter(Boolean);
    }
    return normalized;
  };

  useEffect(() => {
    //Chỉ update từ context nếu KHÔNG có optimistic update
    if (contextComments && contextComments.length > 0 && !isOptimisticUpdateRef.current) {
      const normalizedComments = contextComments
        .map(comment => normalizeComment(comment))
        .filter(Boolean);

      setLocalComments(normalizedComments);
    }
  }, [contextComments]);

  useEffect(() => {
    if (!hasLoadedOnce && postId) {
      loadPostComments(postId, 1, { sortBy, limit: 10 });
      setHasLoadedOnce(true);
    }
  }, [postId, hasLoadedOnce, loadPostComments, sortBy]);

  const handleLoadMore = useCallback(async () => {
    if (!pagination?.hasNext || loading || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      await loadPostComments(postId, pagination.currentPage + 1, { sortBy, limit: 10 });
    } catch (error) {
      toast.error('Failed to load more comments');
    } finally {
      setIsLoadingMore(false);
    }
  }, [pagination, loading, isLoadingMore, loadPostComments, postId, sortBy]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination?.hasNext && !loading && !isLoadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleLoadMore, pagination?.hasNext, loading, isLoadingMore]);

  const handleLikeComment = useCallback(async (commentId) => {
    if (!user) {
      toast.error('Please login to like comments');
      return;
    }

    try {
      await toggleLikeComment(commentId);
      toast.success('Like updated!', {
        position: "bottom-right",
        autoClose: 800,
      });
    } catch (error) {
      toast.error('Failed to like comment. Please try again.');
    }
  }, [user, toggleLikeComment]);

  const sortedComments = useMemo(() => {
    return localComments || [];
  }, [localComments]);

  const handleCreateComment = useCallback(async (content) => {
    if (!content.trim() || submitting) return;

    if (!user) {
      toast.error('Please login to post a comment');
      return;
    }

    setSubmitting(true);
    try {
      const newComment = await createComment({
        postId,
        content: content.trim(),
        parentCommentId: null
      });

      toast.success('Comment posted successfully!');

      if (newComment) {
        const api = newComment?.data || newComment;
        const id = api._id || api.id || `temp-${Date.now()}`;
        const optimisticComment = {
          _id: id,
          id: id,
          content: content.trim(),
          author: {
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            avatar: user.avatar
          },
          createdAt: new Date().toISOString(),
          likesCount: 0,
          isLiked: false,
          replies: [],
          isEdited: false,
          post: postId,
          parentComment: null
        };

        setLocalComments(prev => {
          if (sortBy === 'newest') {
            return [optimisticComment, ...prev];
          } else {
            return [...prev, optimisticComment];
          }
        });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  }, [user, submitting, postId, createComment, sortBy]);

  const handleCreateReply = useCallback(async (content, parentCommentId) => {
    if (!content.trim()) return;
    if (!user) { toast.error('Please login to reply'); return; }
    isOptimisticUpdateRef.current = true;

    try {
      const newReply = await createComment({
        postId,
        content: content.trim(),
        parentCommentId
      });

      const api = newReply?.data || newReply;
      
      toast.success('Reply posted successfully!');

      if (api) {
        const id = api._id || api.id || `temp-reply-${Date.now()}`;
        const optimisticReply = {
          _id: id,
          id: id,
          content: api.content || content.trim(),
          author: api.author || {
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            avatar: user.avatar
          },
          createdAt: api.createdAt || new Date().toISOString(),
          likesCount: api.likesCount ?? 0,
          isLiked: api.isLiked ?? false,
          replies: api.replies ?? [],
          isEdited: api.isEdited ?? false,
          post: api.post || postId,
          parentComment: api.parentComment || parentCommentId
        };

        setLocalComments(prev => {          
          const cloned = JSON.parse(JSON.stringify(prev));
          
          let found = false;
          
          const updateReplies = (comments) => {
            for (let i = 0; i < comments.length; i++) {
              const comment = comments[i];
              const cId = comment._id || comment.id;

              if (cId === parentCommentId) {
                console.log('✨ Found parent comment!', comment);
                found = true;
                if (!comment.replies) comment.replies = [];
                comment.replies.push(optimisticReply);
                return true;
              }

              if (comment.replies && comment.replies.length > 0) {
                if (updateReplies(comment.replies)) {
                  return true;
                }
              }
            }
            return false;
          };

          updateReplies(cloned);
          
          
          return cloned;
        });

      
        setTimeout(() => {
          isOptimisticUpdateRef.current = false;
          loadPostComments(postId, 1, { sortBy, limit: 10 });
        }, 500);
      }
    } catch (error) {
      console.error(' Error:', error);
      toast.error(error.message || 'Failed to post reply.');
      isOptimisticUpdateRef.current = false;
    }
  }, [user, postId, createComment, loadPostComments, sortBy]);

  const handleEditComment = useCallback(async (commentId, content) => {
    if (!content.trim()) {
      toast.error('Comment content cannot be empty');
      return;
    }

    try {
      await updateComment(commentId, content, postId);
      toast.success('Comment updated successfully!');

      setLocalComments(prev => {
        const updateCommentRecursive = (comments) => {
          return comments.map(comment => {
            const cId = comment._id || comment.id;

            if (cId === commentId) {
              return {
                ...comment,
                _id: cId,
                content: content.trim(),
                isEdited: true
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                _id: cId,
                replies: updateCommentRecursive(comment.replies)
              };
            }
            return {
              ...comment,
              _id: cId
            };
          });
        };
        return updateCommentRecursive(prev);
      });
    } catch (error) {
      toast.error(error.message || 'Failed to update comment.');
    }
  }, [updateComment, postId]);

  const handleDeleteComment = useCallback(async (commentId) => {
    const confirmMessage = 'Are you sure you want to delete this comment?';
    if (!window.confirm(confirmMessage)) return;

    try {
      await deleteComment(commentId, postId);
      toast.success('Comment deleted successfully!');

      setLocalComments(prev => {
        const removeCommentRecursive = (comments) => {
          return comments.filter(comment => {
            const cId = comment._id || comment.id;

            if (cId === commentId) {
              return false;
            }
            if (comment.replies && comment.replies.length > 0) {
              comment.replies = removeCommentRecursive(comment.replies);
            }
            return true;
          }).map(comment => ({
            ...comment,
            _id: comment._id || comment.id
          }));
        };
        return removeCommentRecursive(prev);
      });
    } catch (error) {
      toast.error(error.message || 'Failed to delete comment.');
    }
  }, [deleteComment, postId]);

  const handleRefresh = useCallback(() => {
    setHasLoadedOnce(false);
    setLocalComments([]);
    loadPostComments(postId, 1, { sortBy, limit: 10 });
  }, [loadPostComments, postId, sortBy]);

  const handleSortChange = useCallback(async (newSortBy) => {
    if (newSortBy === sortBy) return;

    setSortBy(newSortBy);
    setHasLoadedOnce(false);
    setLocalComments([]);

    try {
      await loadPostComments(postId, 1, { sortBy: newSortBy, limit: 10 });
      toast.success(`Sorted by ${newSortBy}`, {
        position: "bottom-right",
        autoClose: 1000,
      });
    } catch (error) {
      toast.error('Failed to sort comments');
      setSortBy(sortBy);
    }
  }, [sortBy, postId, loadPostComments]);

  const handleDismissError = useCallback(() => {
    clearError();
  }, [clearError]);

  return (
    <div className="border-t border-gray-100 bg-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <CommentStats
            totalComments={pagination?.totalComments || localComments?.length || 0}
            totalReplies={pagination?.totalReplies || 0}
            loading={loading}
          />

          {localComments && localComments.length > 1 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="most_liked">Most Liked</option>
              </select>

              {loading && (
                <div className="w-4 h-4 border border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
          )}
        </div>

        <ErrorDisplay
          error={error}
          onDismiss={handleDismissError}
        />

        <div className="mt-4">
          <CommentList
            comments={sortedComments}
            loading={loading && !isLoadingMore}
            pagination={pagination}
            onLoadMore={() => { }}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
            onLikeComment={handleLikeComment}
            onCreateReply={handleCreateReply}
            onRefresh={handleRefresh}
            hideLoadMoreButton={true}
          />

          {pagination?.hasNext && (
            <div
              ref={observerTarget}
              className="flex justify-center py-4"
            >
              {isLoadingMore && (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Loading more comments...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {!hideCommentForm && (
          <div className="border-t border-gray-100 pt-4 mt-6">
            {user ? (
              <CommentForm
                onSubmit={handleCreateComment}
                placeholder="Write a comment..."
                submitting={submitting}
                size="normal"
                user={user}
              />
            ) : (
              <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">
                  Please{' '}
                  <button
                    className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                    onClick={() => window.location.href = '/login'}
                  >
                    login
                  </button>
                  {' '}to post a comment
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;