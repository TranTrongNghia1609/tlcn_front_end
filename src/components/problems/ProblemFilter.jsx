import React, { useState } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ProblemFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    name: '',
    tag: '',
    difficulty: ''
  });

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleInputChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = { name: '', tag: '', difficulty: '' };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header với icon */}
      <div className="flex items-center space-x-2 mb-4">
        <FunnelIcon className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-gray-900">Filter Problems</h3>
        {hasActiveFilters && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            Active
          </span>
        )}
      </div>

      {/* Filter Controls */}
      <div className="space-y-4">
        <div className="">
          {/* Tên bài */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Tên bài:
            </label>
            <input
              id="name"
              type="text"
              placeholder="Nhập tên bài tập..."
              value={filters.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="text-sm w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Tag */}
          <div className='mt-2'>
            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-2">
              Tag:
            </label>
            <input
              id="tag"
              type="text"
              placeholder="Nhập tag..."
              value={filters.tag}
              onChange={(e) => handleInputChange('tag', e.target.value)}
              className="text-sm w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Độ khó */}
          <div className='mt-2'>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
              Độ khó:
            </label>
            <select
              id="difficulty"
              value={filters.difficulty}
              onChange={(e) => handleInputChange('difficulty', e.target.value)}
              className="text-sm w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
            >
              <option value="">Tất cả</option>
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-500">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => 
              value && (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  <span className="capitalize">{key}: {value}</span>
                  <button
                    onClick={() => handleInputChange(key, '')}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              )
            )}
          </div>
        )}

        {/* Reset Button */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-100">
            <button 
              onClick={handleReset} 
              className="w-full text-center text-sm text-gray-600 hover:text-gray-700 font-medium transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemFilter;