import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../../context/UserContext';
import { useComment } from '../../context/CommentContext';
import {
  CommentForm,
  CommentList,
  CommentStats,
  ErrorDisplay
} from './CommentComponent';

const CommentSection = ({ postId }) => {
  const { user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('oldest');
  const [localComments, setLocalComments] = useState([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

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

  useEffect(() => {
    if (contextComments && contextComments.length > 0) {
      setLocalComments(contextComments);
    }
  }, [contextComments]);

  useEffect(() => {
    if (!hasLoadedOnce && postId) {
      console.log('CommentSection initial load:', {
        postId: postId?.slice(-4),
        sortBy
      });

      // Pass sortBy in options object
      loadPostComments(postId, 1, { sortBy, limit: 10 });
      setHasLoadedOnce(true);
    }
  }, [postId, hasLoadedOnce, loadPostComments, sortBy]);

  const handleLikeComment = useCallback(async (commentId) => {
    if (!user) {
      toast.error('Please login to like comments');
      return;
    }

    try {
      await toggleLikeComment(commentId);

      setTimeout(() => {
        toast.success('Like updated!', {
          position: "bottom-right",
          autoClose: 800,
        });
      }, 100);

    } catch (error) {
      toast.error('Failed to like comment. Please try again.');
    }
  }, [user, toggleLikeComment]);

  // Remove frontend sorting since backend handles it
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
      await createComment({
        postId,
        content: content.trim(),
        parentCommentId: null
      });
      toast.success('Comment posted successfully!');

      //  Reload with current sort after posting - pass options correctly
      setTimeout(() => {
        loadPostComments(postId, 1, { sortBy, limit: 10 });
      }, 500);
    } catch (error) {
      toast.error(error.message || 'Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  }, [user, submitting, postId, createComment, loadPostComments, sortBy]);

  const handleCreateReply = useCallback(async (content, parentCommentId) => {
    if (!content.trim()) return;

    if (!user) {
      toast.error('Please login to reply');
      return;
    }

    try {
      await createComment({
        postId,
        content: content.trim(),
        parentCommentId
      });
      toast.success('Reply posted successfully!');

      //   Reload with current sort after replying
      setTimeout(() => {
        loadPostComments(postId, 1, { sortBy, limit: 10 });
      }, 500);
    } catch (error) {
      toast.error(error.message || 'Failed to post reply.');
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
    } catch (error) {
      toast.error(error.message || 'Failed to delete comment.');
    }
  }, [deleteComment, postId]);

  const handleLoadMore = useCallback(async () => {
    if (!pagination?.hasNext || loading) return;

    try {
      console.log('🔄 Loading more comments:', {
        postId: postId?.slice(-4),
        currentPage: pagination.currentPage,
        nextPage: pagination.currentPage + 1,
        sortBy
      });

      //   Pass sortBy when loading more
      await loadPostComments(postId, pagination.currentPage + 1, { sortBy, limit: 10 });
    } catch (error) {
      toast.error('Failed to load more comments');
    }
  }, [pagination, loading, loadPostComments, postId, sortBy]);

  const handleRefresh = useCallback(() => {
    console.log('🔄 Refreshing comments with sort:', sortBy);
    setHasLoadedOnce(false);

    //   Refresh with current sort
    loadPostComments(postId, 1, { sortBy, limit: 10 });
  }, [loadPostComments, postId, sortBy]);

  //   Enhanced sort change handler - reload comments with new sort
  const handleSortChange = useCallback(async (newSortBy) => {
    if (newSortBy === sortBy) return; // No change

    console.log('🔄 Changing sort:', {
      from: sortBy,
      to: newSortBy,
      postId: postId?.slice(-4)
    });

    setSortBy(newSortBy);
    setHasLoadedOnce(false);

    try {
      //  Reload comments with new sort
      await loadPostComments(postId, 1, { sortBy: newSortBy, limit: 10 });

      toast.success(`Sorted by ${newSortBy}`, {
        position: "bottom-right",
        autoClose: 1000,
      });
    } catch (error) {
      console.error(' Sort change error:', error);
      toast.error('Failed to sort comments');
      // Revert sort if failed
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
                disabled={loading} //   Disable while loading
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="most_liked">Most Liked</option>
              </select>

              {/*  Show loading indicator when sorting */}
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
            loading={loading}
            pagination={pagination}
            onLoadMore={handleLoadMore}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
            onLikeComment={handleLikeComment}
            onCreateReply={handleCreateReply}
            onRefresh={handleRefresh}
          />
        </div>

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
      </div>
    </div>
  );
};

export default CommentSection;