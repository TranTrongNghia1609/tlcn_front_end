import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BarChart3, ListTodo, Trophy } from 'lucide-react'
import RankingContest from './ContestRanking'
import { isContestRunning } from '@/utils/contestHepler'
import { contestStore } from '@/zustand/contestStore'

// Mock data cho ranking
const mockRankingData = [
  { id: 1, name: 'Alice Nguyen', avatar: '', score: 950, rank: 1 },
  { id: 2, name: 'Bob Tran', avatar: '', score: 920, rank: 2 },
  { id: 3, name: 'Charlie Le', avatar: '', score: 890, rank: 3 },
  { id: 4, name: 'David Pham', avatar: '', score: 850, rank: 4 },
  { id: 5, name: 'Eva Hoang', avatar: '', score: 820, rank: 5 },
]

export default function ContestSidebar({contestId}) {
  const contest = contestStore((state) => state.contest);
  
  return (
    <RankingContest
      contestId={contestId}
      isDisplayProblemDetail={true}
      isRunning={isContestRunning(contest)}
              />
  )
}