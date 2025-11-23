import React from 'react'
import { Calendar, Trophy, Users } from 'lucide-react'

const ContestSideBar = () => {
  return (
    <div className="space-y-4">
      {/* Filter by Status */}
      <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-4 hover:shadow-xl transition-shadow">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-purple-600">
          <Calendar className="w-5 h-5" />
          Trạng thái
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-0" 
            />
            <span className="text-sm group-hover:text-blue-600 transition-colors">Sắp diễn ra</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="rounded text-purple-600 focus:ring-purple-500 focus:ring-offset-0" 
            />
            <span className="text-sm group-hover:text-purple-600 transition-colors">Đang diễn ra</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="rounded text-gray-600 focus:ring-gray-500 focus:ring-offset-0" 
            />
            <span className="text-sm group-hover:text-gray-600 transition-colors">Đã kết thúc</span>
          </label>
        </div>
      </div>

      {/* Filter by Type */}
      <div className="bg-white rounded-lg shadow-lg border border-blue-100 p-4 hover:shadow-xl transition-shadow">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-600">
          <Users className="w-5 h-5" />
          Loại cuộc thi
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-0" 
            />
            <span className="text-sm group-hover:text-blue-600 transition-colors">Công khai</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="rounded text-purple-600 focus:ring-purple-500 focus:ring-offset-0" 
            />
            <span className="text-sm group-hover:text-purple-600 transition-colors">Riêng tư</span>
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg border border-purple-200 p-4 hover:shadow-xl transition-shadow">
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