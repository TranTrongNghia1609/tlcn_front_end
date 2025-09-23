import React from 'react';

const CommentContent = ({ 
  content,
  isEditing = false,
  editContent = '',
  onEditContentChange,
  onSaveEdit,
  onCancelEdit
}) => {
  if (isEditing) {
    return (
      <div className="space-y-2">
        <textarea
          value={editContent}
          onChange={(e) => onEditContentChange(e.target.value)}
          className="w-full p-2 text-sm border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="2"
        />
        <div className="flex space-x-2">
          <button
            onClick={onSaveEdit}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={onCancelEdit}
            className="px-3 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return <p className="text-sm text-gray-700">{content}</p>;
};

export default CommentContent;