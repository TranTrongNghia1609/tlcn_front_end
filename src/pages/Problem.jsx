import ProblemList from '@/components/problems/ProblemList';
import ProblemSideBar from '@/components/problems/ProblemSideBar';
import React, { useState } from 'react';

const Problems = () => {
  const [filters, setFilters] = useState({ name: '', tag: '', difficulty: '' });

  const handleFilterChange = (newFilters) => {
    console.log('Filters updated:', newFilters);
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ProblemList filters={filters} />
          </div>
          <div className="lg:col-span-1">
            <ProblemSideBar onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problems;