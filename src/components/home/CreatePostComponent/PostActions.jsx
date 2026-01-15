import React from 'react';
import { CodeBracketIcon } from '@heroicons/react/24/outline';

const PostActions = ({
  showCodeEditor,
  onToggleCodeEditor,
  onCancel,
  onSubmit,
  isSubmitting,
  canSubmit,
  submitText = 'Post',
  isEditMode = false // ✅ Add this prop
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={onToggleCodeEditor}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
            showCodeEditor
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          disabled={isSubmitting}
        >
          <CodeBracketIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Code</span>
        </button>
      </div>

      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isEditMode ? 'Hủy' : 'Cancel'}
        </button>
        
        <button
          type="submit"
          disabled={!canSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {submitText}
        </button>
      </div>
    </div>
  );
};

export default PostActions;