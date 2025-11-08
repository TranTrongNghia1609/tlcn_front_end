import React, { useState, useRef, useEffect } from 'react';
import CommentContentWithMentions from './CommentContentWithMentions';

const CommentContent = ({ content, isEditing, onSubmit, onCancel }) => {
  const [editContent, setEditContent] = useState(content);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      setEditContent(content);
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          textareaRef.current.value.length,
          textareaRef.current.value.length
        );
      }
    }
  }, [isEditing, content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editContent.trim() && editContent !== content) {
      onSubmit(editContent.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="mt-2">
        <textarea
          ref={textareaRef}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows="3"
        />
        <div className="flex space-x-2 mt-2">
          <button
            type="submit"
            disabled={!editContent.trim() || editContent === content}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return <CommentContentWithMentions content={content} />;
};

export default CommentContent;