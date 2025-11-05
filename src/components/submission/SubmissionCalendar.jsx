import React, { act, useEffect, useState } from 'react';
import ActivityCalendar from 'react-activity-calendar';
import { Card } from '@/components/ui/card';
import { getSubmissionCalendar } from '@/services/submissionService';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
const SubmissionCalendar = ({ userId, year = 2024 }) => {
  // Transform your submission data to activity calendar format
  // Expected format: [{ date: '2024-01-01', count: 5, level: 0-4 }, ...]
  const [data, setData] = useState([]);
  const [activityData, setActivityData] = useState([{date: '2025-01-01', count: 0, level: 0}]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchSubmissionCalendar = async () => {
      const response = await getSubmissionCalendar(userId);
      console.log('Data calendar submissions:', response.data);
      setData(response.data);
      setActivityData(transformData(response.data));
      setIsLoading(false);
    }
    fetchSubmissionCalendar();
  },[])
  const transformData = (submissions) => {
    return submissions.map(item => ({
      date: item.date,
      count: item.count,
      level: item.count === 0 ? 0 : 
             item.count < 5 ? 1 : 
             item.count < 10 ? 2 : 
             item.count < 15 ? 3 : 4
    }));
  };


  // GitHub theme colors
  const theme = {
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
  };
  return (
    <div className="">
      <Card>
        <div className='p-4 mx-auto overflow-x-auto'>
          {!isLoading && (<div className='min-w-max'>
            <ActivityCalendar
              className='overflow-auto'
              data={activityData}
              theme={theme}
              colorScheme="light"
              blockSize={14}
              blockMargin={2}
              fontSize={12}
              hideColorLegend={false}
              showWeekdayLabels={true}
              year={year}
              labels={{
                totalCount: '{{count}} submissions in {{year}}',
              }}
              renderBlock={(block, activity) => (
                <Tooltip>
                  <TooltipTrigger asChild>
                    {block}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{`${activity.count} activities on ${activity.date}`}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            />
          </div>)}

          {isLoading && (
            <div className='min-w-max'>
              <ActivityCalendar
                className='overflow-auto'
                theme={theme}
                colorScheme="light"
                loading
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SubmissionCalendar;