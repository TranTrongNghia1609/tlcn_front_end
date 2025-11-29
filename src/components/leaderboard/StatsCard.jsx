import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award } from 'lucide-react'

const StatsCard = ({ data }) => {
  const totalUsers = data.length
  const totalSolved = data.reduce((sum, user) => sum + user.solved, 0)
  const avgPoints = Math.round(data.reduce((sum, user) => sum + user.points, 0) / totalUsers)
  const maxStreak = Math.max(...data.map(user => user.streak))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-500" />
          Thống Kê
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tổng người dùng</span>
            <span className="font-bold text-gray-900">{totalUsers}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tổng bài đã giải</span>
            <span className="font-bold text-gray-900">{totalSolved.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Trung bình điểm</span>
            <span className="font-bold text-gray-900">{avgPoints.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Streak cao nhất</span>
            <span className="font-bold text-gray-900">{maxStreak} ngày</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StatsCard