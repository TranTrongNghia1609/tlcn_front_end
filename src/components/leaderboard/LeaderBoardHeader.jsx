import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const LeaderboardHeader = ({ timeFilter, setTimeFilter }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-800">Bảng Xếp Hạng</h1>
          </div>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">Mọi thời gian</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

export default LeaderboardHeader