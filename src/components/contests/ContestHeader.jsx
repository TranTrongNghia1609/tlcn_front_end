import { contestStore } from "@/zustand/contestStore"

export default function ContestHeader() {
  const contest = contestStore((state) => state.contest)
  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getContestStatus = () => {
    const now = new Date()
    const startTime = new Date(contest.startTime)
    const endTime = new Date(contest.endTime)

    if (now < startTime) {
      return { label: 'Upcoming', color: 'bg-blue-500' }
    } else if (now > endTime) {
      return { label: 'Ended', color: 'bg-gray-500' }
    } else {
      return { label: 'Ongoing', color: 'bg-green-500' }
    }
  }

  const status = getContestStatus()

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h1 className="text-5xl font-bold text-purple-600">{contest.title}</h1>
        <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${status.color}`}>
          {status.label}
        </span>
      </div>
      <div className="flex items-center gap-6 text-muted-foreground">
        <span className="text-sm">Start: {formatDateTime(contest.startTime)}</span>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${status.color}`}></span>
          <span className="text-sm">End: {formatDateTime(contest.endTime)}</span>
        </div>
      </div>
    </div>
  )
}