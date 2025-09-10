import React from 'react';
import { CodeBracketIcon } from '@heroicons/react/24/outline';

const PostActions = ({ 
  showCodeEditor, 
  onToggleCodeEditor, 
  onCancel, 
  onSubmit, 
  isSubmitting, 
  canSubmit 
}) => {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <div className="flex items-center space-x-4">
        {/* Code Toggle */}
        <button
          type="button"
          onClick={onToggleCodeEditor}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            showCodeEditor
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          <CodeBracketIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Code</span>
        </button>
      </div>

      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default PostActions;