import React from 'react';
import CommentItem from './CommentItem';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const CommentList = ({
  comments,
  loading,
  pagination,
  onLoadMore,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onCreateReply,
  onRefresh,
  hideLoadMoreButton = false
}) => {
  if (loading && (!comments || comments.length === 0)) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading comments...</p>
        </div>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div>
            <p className="text-gray-500 font-medium">No comments yet</p>
            <p className="text-gray-400 text-sm mt-1">Be the first to comment!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">
          {pagination?.totalComments || comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h3>
        
        {comments.length > 0 && (
          <button
            onClick={onRefresh}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            disabled={loading}
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        )}
      </div>

      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onEditComment={onEditComment}
          onDeleteComment={onDeleteComment}
          onLikeComment={onLikeComment}
          onCreateReply={onCreateReply}
        />
      ))}

      {!hideLoadMoreButton && pagination?.hasNext && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load More Comments'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentList;