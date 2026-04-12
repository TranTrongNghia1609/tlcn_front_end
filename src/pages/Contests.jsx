import ContestList from '@/components/contests/ContestList'
import ContestSideBar from '@/components/contests/ContestFilter'
import React, { useState } from 'react'
import ContestUpcoming from '@/components/contests/ContestUpcoming'

const Contests = () => {
  const [filters, setFilters] = useState({});
  const handleFilterChange = (newFilters) => {
    console.log('Filters updated:', newFilters);
    setFilters(newFilters);
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-6">
        <div className='mb-2'>
          <ContestUpcoming />
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-3">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <ContestList filter={filters}/>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ContestSideBar onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contests