import React, { useState } from 'react';
import { XMarkIcon, TagIcon } from '@heroicons/react/24/outline';

const TagsInput = ({ tags, onAddTag, onRemoveTag, maxTags = 5 }) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < maxTags) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="mb-4">
      {/* Tags Display */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
          >
            #{tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>
      
      {/* Add Tag Input */}
      {tags.length < maxTags && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Add tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={20}
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!newTag.trim()}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      )}

      {/* Tag Counter */}
      <div className="flex items-center space-x-2 px-3 py-2 text-gray-600">
        <TagIcon className="w-5 h-5" />
        <span className="text-sm font-medium">{tags.length}/{maxTags}</span>
      </div>
    </div>
  );
};

export default TagsInput;