import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const LevelDistributionCard = ({ data }) => {
  const levelCounts = data.reduce((acc, user) => {
    acc[user.level] = (acc[user.level] || 0) + 1
    return acc
  }, {})

  const levelColors = {
    'Grandmaster': 'text-purple-600',
    'Master': 'text-red-600',
    'Expert': 'text-orange-600',
    'Advanced': 'text-blue-600',
    'Intermediate': 'text-green-600',
    'Beginner': 'text-gray-600'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân Bổ Level</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(levelCounts).map(([level, count]) => (
            <div key={level} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{level}</span>
              <span className={`text-sm font-semibold ${levelColors[level]}`}>{count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default LevelDistributionCard