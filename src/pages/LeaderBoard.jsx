import React, { useState } from 'react'
import LeaderboardHeader from '@/components/leaderboard/LeaderBoardHeader'
import LeaderboardTable from '@/components/leaderboard/LeaderBoardTable'
import TopThreeCard from '@/components/leaderboard/TopThreeCard'
import StatsCard from '@/components/leaderboard/StatsCard'
import LevelDistributionCard from '@/components/leaderboard/LevelDistributionCard'

export const leaderboardData = [
  { rank: 1, username: 'CodeMaster2024', avatar: '🏆', points: 15420, solved: 342, streak: 45, level: 'Grandmaster' },
  { rank: 2, username: 'AlgoNinja', avatar: '🥈', points: 14850, solved: 328, streak: 38, level: 'Grandmaster' },
  { rank: 3, username: 'DevGenius', avatar: '🥉', points: 13920, solved: 315, streak: 32, level: 'Master' },
  { rank: 4, username: 'ByteWarrior', avatar: '👨‍💻', points: 12680, solved: 298, streak: 28, level: 'Master' },
  { rank: 5, username: 'StackOverflow', avatar: '💪', points: 11950, solved: 285, streak: 25, level: 'Master' },
  { rank: 6, username: 'BugHunter', avatar: '🐛', points: 10840, solved: 267, streak: 22, level: 'Expert' },
  { rank: 7, username: 'CodingKing', avatar: '👑', points: 9920, solved: 254, streak: 20, level: 'Expert' },
  { rank: 8, username: 'AlgoQueen', avatar: '👸', points: 9350, solved: 241, streak: 18, level: 'Expert' },
  { rank: 9, username: 'DataWizard', avatar: '🧙‍♂️', points: 8740, solved: 228, streak: 16, level: 'Expert' },
  { rank: 10, username: 'LogicMaster', avatar: '🎯', points: 8120, solved: 215, streak: 15, level: 'Advanced' },
  { rank: 11, username: 'CodeNinja99', avatar: '🥷', points: 7560, solved: 203, streak: 14, level: 'Advanced' },
  { rank: 12, username: 'PythonPro', avatar: '🐍', points: 7120, solved: 192, streak: 12, level: 'Advanced' },
  { rank: 13, username: 'JavaJedi', avatar: '☕', points: 6680, solved: 181, streak: 11, level: 'Advanced' },
  { rank: 14, username: 'ReactRuler', avatar: '⚛️', points: 6240, solved: 170, streak: 10, level: 'Intermediate' },
  { rank: 15, username: 'NodeNinja', avatar: '🟢', points: 5820, solved: 159, streak: 9, level: 'Intermediate' },
  { rank: 16, username: 'GitGuru', avatar: '🔱', points: 5410, solved: 148, streak: 8, level: 'Intermediate' },
  { rank: 17, username: 'APIAce', avatar: '🎮', points: 5050, solved: 137, streak: 7, level: 'Intermediate' },
  { rank: 18, username: 'DatabaseDev', avatar: '💾', points: 4690, solved: 126, streak: 6, level: 'Beginner' },
  { rank: 19, username: 'FrontEndFan', avatar: '🎨', points: 4350, solved: 115, streak: 5, level: 'Beginner' },
  { rank: 20, username: 'BackEndBoss', avatar: '⚙️', points: 4020, solved: 104, streak: 4, level: 'Beginner' }
]

const LeaderBoard = () => {
  const [timeFilter, setTimeFilter] = useState('all-time')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <LeaderboardTable data={leaderboardData} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <TopThreeCard data={leaderboardData} />
            <StatsCard data={leaderboardData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderBoard