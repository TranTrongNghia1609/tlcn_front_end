import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Medal } from 'lucide-react'

const TopThreeCard = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Medal className="w-6 h-6 text-yellow-500" />
          Top 3 Xuất Sắc
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.slice(0, 3).map((user) => (
            <div 
              key={user.rank} 
              className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
            >
              <span className="text-3xl">{user.avatar}</span>
              <div className="flex-1">
                <div className="font-bold text-gray-900">{user.username}</div>
                <div className="text-sm text-gray-600">{user.points.toLocaleString()} điểm</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TopThreeCard