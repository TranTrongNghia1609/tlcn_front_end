import ContestList from '@/components/contests/ContestList'
import ContestSideBar from '@/components/contests/ContestFilter'
import React from 'react'

const Contests = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <ContestList />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ContestSideBar />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contests