import React, { useState, useEffect } from 'react'
import { Clock, Lock, Unlock, CheckCheck } from 'lucide-react'
import { getContests } from '@/services/contestService'
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import contestCover1 from '@/assets/contest-cover-1.png';
import contestCover2 from '@/assets/contest-cover-2.png';
import contestCover3 from '@/assets/contest-cover-3.png';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const imageList = [contestCover1, contestCover2, contestCover3];
const ContestList = ({filter}) => {
  const [contests, setContests] = useState([])
  const [loading, setLoading] = useState(true)
  const [contestPagination, setContestPagination] = useState()
  const [pageActive, setPageActive] = useState(1)
  const navigate = useNavigate();
  useEffect(() => {
    fetchContests()
  }, [pageActive, filter])

  const fetchContests = async () => {
    try {
      const params = { page: pageActive, status: filter?.status, type: filter?.type }
      const data = await getContests(params)
      setContests(data.data.content)
      setContestPagination(data.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching contests:', error)
      setLoading(false)
    }
  }

  const getContestStatus = (startTime, endTime) => {
    const now = new Date()
    const start = new Date(startTime)
    const end = new Date(endTime)

    if (now < start) return 'upcoming'
    if (now > end) return 'ended'
    return 'ongoing'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: 'bg-blue-100 text-blue-700',
      ongoing: 'bg-purple-100 text-purple-700',
      ended: 'bg-gray-100 text-gray-700'
    }
    const labels = {
      upcoming: 'Sắp diễn ra',
      ongoing: 'Đang diễn ra',
      ended: 'Đã kết thúc'
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
        <p className="mt-2 text-purple-600">Đang tải...</p>
      </div>
    )
  }

  const getHasRegistered = (contest) => {
    const now = new Date();
    const start = new Date(contest.startTime);
    return contest.isRegistered && now < start;
  }

  return (
    <div className="space-y-3">
      {/* <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Danh sách cuộc thi
        </h2>
      </div> */}

      <div className="space-y-2">
        {contests.map((contest, idx) => {
          const status = getContestStatus(contest.startTime, contest.endTime)
          
          return (
            <Card
              key={contest._id}
              className="cursor-pointer group border-gray-200
                         transition-all duration-300 ease-in-out
                         hover:shadow-lg hover:-translate-y-1 hover:border-purple-300
                         relative"
              onClick={() => {navigate(`/contest/${contest.code}`)}}
            >
              {/* Ảnh ở góc phải - bị crop bởi đường line */}
              <div 
                className="absolute top-0 right-0 w-2/5 h-full"
                style={{
                  clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0% 100%)"
                }}
              >
                <img 
                  src={imageList[idx % 3]}
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay để làm tối ảnh nếu cần */}
              <div 
                className="absolute top-0 right-0 w-2/5 h-full bg-black/10"
                style={{
                  clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0% 100%)"
                }}
              />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                        {contest.title}
                      </CardTitle>
                      {contest.isPrivate ? (
                        <Lock className="w-4 h-4 text-purple-500" />
                      ) : (
                        <Unlock className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Mã: <span className="font-mono font-medium text-purple-600">{contest.code}</span>
                    </p>
                  </div>
                  {getStatusBadge(status)}
                </div>
              </CardHeader>

              <CardContent>
                <div className='flex items-center justify-between'> 
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Bắt đầu: {formatDate(contest.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>Kết thúc: {formatDate(contest.endTime)}</span>
                    </div>
                  </div>
                  <div>
                    {getHasRegistered(contest) && (
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <CheckCheck className="w-4 h-4" />
                        <span className='text-sm'>Đã đăng ký</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {contests.length === 0 && (
          <div className="bg-white rounded-lg border border-purple-100 p-8 text-center">
            <p className="text-gray-500 mb-2">Không có cuộc thi nào</p>
            <div className="text-4xl opacity-20">🏆</div>
          </div>
        )}
      </div>

      {contestPagination && contestPagination.totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-lg border border-purple-100 p-4">
          <Pagination className="cursor-pointer">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => pageActive > 1 ? setPageActive(pageActive - 1) : {}}
                  className={pageActive === 1 ? "pointer-events-none opacity-50" : "hover:bg-purple-50"}
                />
              </PaginationItem>
              {
                Array.from({ length: contestPagination.totalPages }, (_, index) => {
                  const page = index + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        onClick={() => {
                          setPageActive(page);
                          setLoading(true)
                        }}
                        isActive={page === contestPagination.page}
                        className={page === contestPagination.page 
                          ? "" 
                          : "hover:bg-purple-50"}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })
              }
              <PaginationItem>
                <PaginationNext 
                  onClick={() => pageActive < contestPagination.totalPages ? setPageActive(pageActive + 1) : {}}
                  className={pageActive === contestPagination.totalPages ? "pointer-events-none opacity-50" : "hover:bg-purple-50"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

export default ContestList