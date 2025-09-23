import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '../../../context/UserContext';

const CommentForm = ({ 
  onSubmit, 
  placeholder = "Write a comment...", 
  submitting = false,
  isReply = false,
  onCancel = null,
  size = "normal" // ✅ New prop: "normal" or "small"
}) => {
  const { user } = useUser();
  const [content, setContent] = useState('');
  const textareaRef = useRef(null);

  // ✅ Auto focus khi là reply form
  useEffect(() => {
    if (isReply && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isReply]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    await onSubmit(content.trim());
    setContent('');
  };

  const handleCancel = () => {
    setContent('');
    if (onCancel) onCancel();
  };
  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
    
    if (e.key === 'Escape' && isReply) {
      handleCancel();
    }
  };

  if (!user) {
    return (
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-700">Please login to comment</p>
      </div>
    );
  }

  // ✅ Different styles based on size
  const avatarSize = size === "small" ? 'w-6 h-6' : 'w-10 h-10';
  const textareaRows = size === "small" ? "2" : "3";
  const textareaClass = size === "small" ? 'text-sm' : '';
  const containerClass = isReply ? '' : 'mb-6';

  return (
    <form onSubmit={handleSubmit} className={containerClass}>
      <div className="flex space-x-3">
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&size=${size === "small" ? '32' : '40'}&background=2563eb&color=fff`}
          alt={user.userName}
          className={`${avatarSize} rounded-full object-cover flex-shrink-0`}
        />
        
        <div className="flex-1">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${textareaClass}`}
              rows={textareaRows}
              disabled={submitting}
            />
            
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              {/*  Cancel button for replies */}
              {isReply && onCancel && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Cancel (Esc)"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
              
              <button
                type="submit"
                disabled={!content.trim() || submitting}
                className="p-2 text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Submit (Ctrl+Enter)"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <PaperAirplaneIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          
          {/* Helper text for keyboard shortcuts */}
          {isReply && (
            <div className="mt-1 text-xs text-gray-500">
              Press Ctrl+Enter to submit, Esc to cancel
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default CommentForm;