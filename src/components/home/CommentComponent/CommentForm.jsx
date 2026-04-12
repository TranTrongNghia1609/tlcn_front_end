import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';

const CommentForm = ({ 
  onSubmit, 
  placeholder = "Write a comment...", 
  submitting = false,
  isReply = false,
  onCancel = null,
  size = "normal",
  user,
  mentionUser = null
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isReply && textareaRef.current) {
      if (mentionUser) {
        const mentionName = mentionUser.fullName || mentionUser.userName;
        setContent(`@${mentionName} `);
      }
      textareaRef.current.focus();
      
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isReply, mentionUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() || submitting || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    if (onCancel) onCancel();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isReply) {
      e.preventDefault();
      handleCancel();
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      if (!content.trim() || submitting || isSubmitting) return;
      
      handleSubmit(e);
    }
  };

  if (!user) {
    return (
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-700">Please login to comment</p>
      </div>
    );
  }

  const avatarSize = size === "small" ? 'w-6 h-6' : 'w-10 h-10';
  const textareaRows = size === "small" ? "2" : "3";
  const textareaClass = size === "small" ? 'text-sm' : '';
  const containerClass = isReply ? '' : 'mb-6';
  const isButtonDisabled = !content.trim() || submitting || isSubmitting;

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
              disabled={submitting || isSubmitting}
            />
            
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
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
                disabled={isButtonDisabled}
                className="p-2 text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Submit (Enter)"
              >
                {(submitting || isSubmitting) ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <PaperAirplaneIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          
          {isReply && (
            <div className="mt-1 text-xs text-gray-500">
              Press Enter to submit, Shift+Enter for new line, Esc to cancel
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default CommentForm;