import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CodeEditor = ({ value, onChange, onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">Code Snippet</label>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      <textarea
        placeholder="// Your code here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 bg-gray-900 text-green-400 font-mono text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows="8"
        style={{ fontFamily: 'Monaco, Consolas, "Lucida Console", monospace' }}
      />
    </div>
  );
};

export default CodeEditor;