import React, { useState } from 'react'
import { Calendar, Trophy, Users } from 'lucide-react'

const ContestSideBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    status: [],
    type: 'all' // Đổi thành string vì radio chỉ chọn 1 giá trị
  })

  const handleStatusChange = (status) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status]
    
    const newFilters = { ...filters, status: newStatus }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleTypeChange = (type) => {
    const newFilters = { ...filters, type }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  return (
    <div className="space-y-4">
      {/* Filter by Status */}
      <div className="bg-white rounded-lg shadow-lg border-2 border-purple-100 p-4 hover:shadow-xl transition-shadow">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-purple-600">
          <Calendar className="w-5 h-5" />
          Trạng thái
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              value="upcoming"
              type="checkbox"
              checked={filters.status.includes('upcoming')}
              onChange={() => handleStatusChange('upcoming')}
              className="rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className="text-sm group-hover:text-blue-600 transition-colors">Sắp diễn ra</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              value="ongoing"
              type="checkbox"
              checked={filters.status.includes('ongoing')}
              onChange={() => handleStatusChange('ongoing')}
              className="rounded text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
            />
            <span className="text-sm group-hover:text-purple-600 transition-colors">Đang diễn ra</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              value="ended"
              type="checkbox"
              checked={filters.status.includes('ended')}
              onChange={() => handleStatusChange('ended')}
              className="rounded text-gray-600 focus:ring-gray-500 focus:ring-offset-0"
            />
            <span className="text-sm group-hover:text-gray-600 transition-colors">Đã kết thúc</span>
          </label>
        </div>
      </div>

      {/* Filter by Type */}
      <div className="bg-white rounded-lg shadow-lg border-2 border-blue-100 p-4 hover:shadow-xl transition-shadow">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-600">
          <Users className="w-5 h-5" />
          Loại cuộc thi
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="contestType"
              value="all"
              checked={filters.type === 'all'}
              onChange={() => handleTypeChange('all')}
              className="text-gray-600 focus:ring-gray-500 focus:ring-offset-0"
            />
            <span className="text-sm group-hover:text-gray-600 transition-colors">Tất cả</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="contestType"
              value="public"
              checked={filters.type === 'public'}
              onChange={() => handleTypeChange('public')}
              className="text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className="text-sm group-hover:text-blue-600 transition-colors">Công khai</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="contestType"
              value="private"
              checked={filters.type === 'private'}
              onChange={() => handleTypeChange('private')}
              className="text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
            />
            <span className="text-sm group-hover:text-purple-600 transition-colors">Riêng tư</span>
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg border-2 border-purple-200 p-4 hover:shadow-xl transition-shadow">
        <h3 className="font-semibold mb-3 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          <Trophy className="w-5 h-5 text-purple-600" />
          Thống kê
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-2 bg-white rounded-lg">
            <span className="text-gray-600">Tổng cuộc thi:</span>
            <span className="font-semibold text-purple-600">0</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white rounded-lg">
            <span className="text-gray-600">Đã tham gia:</span>
            <span className="font-semibold text-blue-600">0</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContestSideBar