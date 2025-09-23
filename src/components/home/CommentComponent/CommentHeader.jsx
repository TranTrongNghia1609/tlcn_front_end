import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const CommentHeader = ({ 
  author, 
  createdAt, 
  isEdited = false,
  isAuthor = false,
  onEdit,
  onDelete
}) => {
  return (
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-sm text-gray-900">
          {author?.fullName || author?.userName || 'Anonymous'}
        </span>
        <span className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
        {isEdited && (
          <span className="text-xs text-gray-400">(edited)</span>
        )}
      </div>
      
      {isAuthor && (
        <div className="flex items-center space-x-1">
          <button
            onClick={onEdit}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentHeader;