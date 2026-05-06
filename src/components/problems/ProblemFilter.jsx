import React, { useEffect, useState } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ProblemFilter = ({ filters, onFilterChange }) => {
  const parentFilters = {
    name: filters?.name || '',
    tag: filters?.tag || '',
    difficulty: filters?.difficulty || '',
  };

  const [localFilters, setLocalFilters] = useState(parentFilters);

  useEffect(() => {
    setLocalFilters((prev) => {
      if (
        prev.name === parentFilters.name &&
        prev.tag === parentFilters.tag &&
        prev.difficulty === parentFilters.difficulty
      ) {
        return prev;
      }

      return parentFilters;
    });
  }, [parentFilters.name, parentFilters.tag, parentFilters.difficulty]);

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const hasPendingChanges =
    localFilters.name !== parentFilters.name ||
    localFilters.tag !== parentFilters.tag ||
    localFilters.difficulty !== parentFilters.difficulty;

  const submitFilters = () => {
    const submitted = {
      name: String(localFilters.name || '').trim(),
      tag: String(localFilters.tag || '').trim(),
      difficulty: localFilters.difficulty || '',
    };

    onFilterChange(submitted);
  };

  const handleApplySubmit = (event) => {
    event.preventDefault();
    submitFilters();
  };

  const handleInputChange = (field, value) => {
    const nextFilters = { ...localFilters, [field]: value };

    if (nextFilters[field] === localFilters[field]) {
      return;
    }

    setLocalFilters(nextFilters);
  };

  const handleRemoveFilter = (field) => {
    const nextFilters = { ...localFilters, [field]: '' };
    setLocalFilters(nextFilters);
  };

  const handleReset = () => {
    const resetFilters = { name: '', tag: '', difficulty: '' };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // Check if any filter is active
  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

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
      <form className="space-y-4" onSubmit={handleApplySubmit}>
        <div className="">
          {/* Tên bài */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Problem Name:
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter problem name..."
              value={localFilters.name}
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
              placeholder="Enter tag..."
              value={localFilters.tag}
              onChange={(e) => handleInputChange('tag', e.target.value)}
              className="text-sm w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Độ khó */}
          <div className='mt-2'>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty:
            </label>
            <select
              id="difficulty"
              value={localFilters.difficulty}
              onChange={(e) => handleInputChange('difficulty', e.target.value)}
              className="text-sm w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
            >
              <option value="">All</option>
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
            {Object.entries(localFilters).map(([key, value]) =>
              value && (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  <span className="capitalize">{key}: {value}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFilter(key)}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              )
            )}
          </div>
        )}

        <div className="pt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={!hasPendingChanges}
            className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            Apply Filters
          </button>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleReset}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-700 font-medium transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProblemFilter;