import React from 'react';
import CommentItem from './CommentItem';
import LoadMoreButton from './LoadMoreButton';
import ErrorDisplay from './ErrorDisplay';

const CommentList = ({
  comments = [],
  loading = false,
  error = null,
  pagination = null,
  onLoadMore,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onCreateReply,
  hideReplies = true // Default to hide replies
}) => {
  // Safety check
  const validComments = Array.isArray(comments) 
    ? comments.filter(comment => comment && typeof comment === 'object' && comment._id)
    : [];

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (loading && validComments.length === 0) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading comments...</span>
      </div>
    );
  }

  if (validComments.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {validComments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onEditComment={onEditComment}
          onDeleteComment={onDeleteComment}
          onLikeComment={onLikeComment}
          onCreateReply={onCreateReply}
          hideReplies={hideReplies}
        />
      ))}

      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-sm text-gray-600">Loading more comments...</span>
        </div>
      )}

      {pagination && pagination.hasNext && !loading && (
        <LoadMoreButton 
          onClick={onLoadMore} 
          total={pagination.totalParentComments}
          loaded={validComments.length}
        />
      )}
    </div>
  );
};

export default CommentList;