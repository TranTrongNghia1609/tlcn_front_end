import { Button } from '@/components/ui/button'
import { registerToContest } from '@/services/contestService'
import { contestStore } from '@/zustand/contestStore'
import { Play, MessageCircle, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
const CONTEST_STATUS = {
  "ongoing": {
    lable: "Tham gia ngay",
    style: "bg-green-100 text-green-600 hover:bg-green-600 hover:text-white",
    itemColor: "fill-green-600",
    type: 1
  },
  "register": {
    lable: "Đăng ký",
    style: "bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white",
    itemColor: "fill-blue-600",
    type: 2,
  },
  "ended": {
    lable: "Thi ảo",
    style: "bg-gray-100 text-gray-600 hover:bg-gray-600 hover:text-white",
    itemColor: "fill-gray-600",
    type: 3
  },
  "registered": {
    lable: "Đã đăng ký",
    style: "cursor-auto hover:bg-purple-100 hover:text-purple-600 bg-purple-100 text-purple-600",
    itemColor: "fill-purple-600 hidden"
  },  
  "expired": {
    lable: "Hết hạn",
    style: "cursor-auto bg-red-100 text-red-600 hover:bg-red-100 hover:text-red-600",
    itemColor: "fill-red-600 hidden"
  }
}
export default function ContestActions() {
  const contest = contestStore((state) => state.contest)
  const setContest = contestStore((state) => state.setContest)
  const navigate = useNavigate();
  const getAction = () => {
    const now = new Date()
    const startTime = new Date(contest.startTime)
    const endTime = new Date(contest.endTime)
    
    
    if (now < startTime){
      return !contest.userParticipation.isRegistered ? CONTEST_STATUS.register : CONTEST_STATUS.registered;
    }
    else if (now <= endTime){
      return !contest.userParticipation.isRegistered ? CONTEST_STATUS.register : CONTEST_STATUS.ongoing;
    }
    else {
      if (contest.userParticipation === null || contest.userParticipation.mode === 'official'){
        return CONTEST_STATUS.ended
      }

      if (contest.userParticipation.endTime < now){
        return CONTEST_STATUS.ended
      }

      else if (contest.userParticipation.startTime <= now){
        return CONTEST_STATUS.ongoing
      }
      
      else{
        return contest.userParticipation.isRegistered ? CONTEST_STATUS.registered : CONTEST_STATUS.ended;
      }
    }
  }

  const action = getAction();
  const handleClick = async () => {
    if (action.type == 2){
      try {
        const response = await registerToContest(contest._id);
        alert('Đăng ký cuộc thi thành công!');
        window.location.reload();

      } catch (error) {
        console.error('Error registering to contest:', error);
        alert('Đăng ký cuộc thi thất bại. Vui lòng thử lại.');
      }
    }
    else if (action.type == 1){
      navigate(`/contest/${contest.code}/problem/${contest.problems[0].shortId}`);
    }
  }
  return (
    <div className="flex items-center gap-3">
      <Button
        className={`cursor-pointer gap-2 rounded-full px-6 ${action.style}`}
        variant="ghost"
        onClick={handleClick}
      >
        <Play className={`w-4 h-4 ${action.itemColor}`} />
        {action.lable}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-muted hover:bg-muted/80"
      >
        <MessageCircle className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-muted hover:bg-muted/80"
      >
        <ExternalLink className="w-5 h-5" />
      </Button>
    </div>
  )
}
