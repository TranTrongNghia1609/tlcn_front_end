import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BarChart3, ListTodo, Trophy } from 'lucide-react'

// Mock data cho ranking
const mockRankingData = [
  { id: 1, name: 'Alice Nguyen', avatar: '', score: 950, rank: 1 },
  { id: 2, name: 'Bob Tran', avatar: '', score: 920, rank: 2 },
  { id: 3, name: 'Charlie Le', avatar: '', score: 890, rank: 3 },
  { id: 4, name: 'David Pham', avatar: '', score: 850, rank: 4 },
  { id: 5, name: 'Eva Hoang', avatar: '', score: 820, rank: 5 },
]

export default function ContestSidebar() {
  return (
    <>
      {/* Ranking Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-600 text-lg">Ranking</h3>
          </div>
          <div className="flex -space-x-2">
            {mockRankingData.slice(0, 4).map((user) => (
              <Avatar key={user.id} className="w-6 h-6 border-2 border-white">
                <AvatarFallback className="text-xs bg-purple-300 text-purple-900">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
        
        {/* Ranking List */}
        <div className="space-y-2">
          {mockRankingData.map((user) => (
            <RankingItem key={user.id} user={user} />
          ))}
        </div>
        
        <p className="text-sm text-purple-700 text-center pt-2 border-t border-purple-200">
          View detailed rankings and competition standings
        </p>
      </Card>
    </>
  )
}

function RankingItem({ user }) {
  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-600'
    if (rank === 2) return 'text-gray-500'
    if (rank === 3) return 'text-amber-700'
    return 'text-purple-600'
  }

  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/50 transition-colors">
      <div className={`font-bold text-sm w-6 text-center ${getRankColor(user.rank)}`}>
        {user.rank <= 3 ? <Trophy className="w-4 h-4" /> : user.rank}
      </div>
      <Avatar className="w-8 h-8">
        <AvatarImage src={user.avatar} />
        <AvatarFallback className="text-xs bg-purple-300 text-purple-900">
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground truncate">{user.name}</p>
      </div>
      <div className="text-sm font-semibold text-purple-600 bg-white px-2 py-1 rounded">
        {user.score}
      </div>
    </div>
  )
}

function ProblemItem({ title, number }) {
  return (
    <div className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border-b border-border/50 last:border-b-0">
      <p className="font-medium text-sm text-foreground/90">{title}</p>
      <span className="text-sm font-semibold text-muted-foreground bg-muted px-2 py-1 rounded">
        {number}
      </span>
    </div>
  )
}