import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '../ui/card'
import contestCover1 from '@/assets/contest-cover-1.png';
import contestCover2 from '@/assets/contest-cover-3.png';
import { getUpcomingContests } from '@/services/homeService';
import { useNavigate } from 'react-router-dom';

function ContestUpcoming() {
  const [countdowns, setCountdowns] = useState({})
  const [upcomingContests, setUpcomingContests] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  const calculateTimeLeft = (dateStr, timeStr) => {
    const [year, day, month] = dateStr.split('-')
    const [hours, minutes] = timeStr.split(':')
    const contestDate = new Date(year, month - 1, day, hours, minutes)
    const now = new Date();
    const difference = contestDate - now;
    if (difference <= 0) {
      return { expired: true }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdowns = {}
      upcomingContests.forEach(contest => {
        newCountdowns[contest._id] = calculateTimeLeft(contest.date, contest.time)
      })
      setCountdowns(newCountdowns)
    }, 1000)

    return () => clearInterval(timer)
  }, [upcomingContests])

  const convertToDateTime = (dateTimeStr) => {
    let [date, time] = dateTimeStr.split(' ');
    time = time.substring(0, 5);
    return {
      date,
      time
    }
  }

  useEffect(() => {
    const fetchUpcomingContests = async () => {
      try {
        setLoading(true)
        const response = await getUpcomingContests();
        for (const contest of response.data) {
          const { date, time } = convertToDateTime(contest.startTime);
          contest.date = date;
          contest.time = time;
        }
        setUpcomingContests(response.data);
        console.log('Upcoming contests fetched:', response);
      } catch (error) {
        console.error('Error fetching contests:', error);
      } finally {
        setLoading(false)
      }
    }
    fetchUpcomingContests();
  }, []);

  const handleContestClick = (code) => () => {
    navigate(`/contest/${code}`);
  }

  return (
    <div className='mb-50'>
      <div className='w-full relative'>
        <div className='bg-primary/90 flex justify-center items-start w-screen left-0 h-[45vh] bg-[url(@/assets/contest-cover.png)] bg-cover'>
        </div>
        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto absolute left-0 right-0 -bottom-40'>
          {loading ? (
            // Skeleton Loading
            <>
              {[1, 2].map((i) => (
                <Card key={i} className='py-0 animate-pulse'>
                  <CardContent className={'p-0'}>
                    <div className='bg-gray-300 rounded-xl w-full h-48'></div>
                    <div className='space-y-2 p-4'>
                      <div className='h-6 bg-gray-300 rounded w-3/4'></div>
                      <div className='h-4 bg-gray-300 rounded w-1/2'></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            // Actual Content
            upcomingContests.map((contest, idx) => (
              <Card key={contest._id} className='py-0 cursor-pointer hover:shadow-lg transition-shadow hover:text-blue-500'
                onClick={handleContestClick(contest.code)}
              >
                <CardContent className={'p-0'}>
                  <div className=''>
                    <img src={idx % 2 ? contestCover2 : contestCover1} className=' rounded-xl w-full'/>
                  </div>
                  <div className='space-y-2 p-4'>
                    <p className='text-xl font-medium'>
                      {contest.title}</p>
                    <p className='text-sm text-gray-600'>
                      🕐 {countdowns[contest._id] && !countdowns[contest._id].expired 
                        ? `Starts in ${countdowns[contest._id].days}d ${countdowns[contest._id].hours}h ${countdowns[contest._id].minutes}m ${countdowns[contest._id].seconds}s`
                        : countdowns[contest._id]?.expired 
                        ? "Contest has started" 
                        : "Calculating..."}
                    </p>                  
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ContestUpcoming
