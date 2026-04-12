import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star, Code, TrendingUp } from 'lucide-react'
import { Card } from '../ui/card'

const LeaderboardTable = ({ data }) => {
  const getRankBadge = (rank) => {
    if (rank === 1) return 'bg-yellow-400 text-yellow-900'
    if (rank === 2) return 'bg-gray-300 text-gray-900'
    if (rank === 3) return 'bg-orange-400 text-orange-900'
    return 'bg-blue-100 text-blue-900'
  }

  const getLevelColor = (level) => {
    const colors = {
      'Grandmaster': 'bg-purple-100 text-purple-600 hover:bg-purple-100',
      'Master': 'bg-red-100 text-red-600 hover:bg-red-100',
      'Expert': 'bg-orange-100 text-orange-600 hover:bg-orange-100',
      'Advanced': 'bg-blue-100 text-blue-600 hover:bg-blue-100',
      'Intermediate': 'bg-green-100 text-green-600 hover:bg-green-100',
      'Beginner': 'bg-gray-100 text-gray-600 hover:bg-gray-100'
    }
    return colors[level] || 'bg-gray-100 text-gray-600 hover:bg-gray-100'
  }

  return (
    <div className="w-full space-y-3">
      <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Bảng xếp hạng
        </h2>
      </div>
      <Card>
        <Table className='border-border'>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Hạng</TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="text-center">Điểm</TableHead>
              <TableHead className="text-center">Đã giải</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.rank} className="hover:bg-gray-50">
                <TableCell>
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${getRankBadge(user.rank)}`}>
                    {user.rank <= 3 ? (
                      <span className="text-2xl">{user.avatar}</span>
                    ) : (
                      user.rank
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold">
                        {user.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-semibold text-gray-900">{user.username}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getLevelColor(user.level)}>
                    {user.level}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-gray-900">{user.points.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Code className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-gray-700">{user.solved}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default LeaderboardTable