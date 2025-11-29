import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getStatusBadge } from './ProblemSubmission';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { getSubmissionByUserId } from '@/services/submissionService';
function SubmissionRecent({userId}) {
  const mockSubmissions = [
    {
      id: 1,
      when: "2 mins ago",
      who: "john_doe",
      problem: "Two Sum",
      status: "Accepted",
      time: "45ms",
      memory: "42.1MB"
    },
    {
      id: 2,
      when: "5 mins ago",
      who: "jane_smith",
      problem: "Reverse String",
      status: "Wrong Answer",
      time: "32ms",
      memory: "38.5MB"
    },
    {
      id: 3,
      when: "10 mins ago",
      who: "alex_wong",
      problem: "Binary Search",
      status: "Accepted",
      time: "28ms",
      memory: "40.2MB"
    },
    {
      id: 4,
      when: "15 mins ago",
      who: "sarah_lee",
      problem: "Merge Sort",
      status: "Time Limit Exceeded",
      time: "N/A",
      memory: "45.8MB"
    },
    {
      id: 5,
      when: "20 mins ago",
      who: "mike_johnson",
      problem: "Valid Parentheses",
      status: "Accepted",
      time: "18ms",
      memory: "35.9MB"
    }
  ];
  const [ submissions, setSubmissions ] = useState([]);
  const [ pageActive, setPageActive ] = useState(1);
  const [ pagination, setPagination ] = useState({});
  const [ isLoading, setIsLoading ] = useState(false);
  useEffect(() => {
    const fetchSubmssion = async () => {
      setIsLoading(false);
      try {
        const response = await getSubmissionByUserId(userId, null, pageActive); 
        setPagination({page: response.page, totalPages: response.totalPages, last: response.last});
        setSubmissions(response.data.content);
      }
      catch (error){
        console.error('Error fetching submissions:', error);
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchSubmssion();
  }, [userId, pageActive]);
  // --- Helper format riêng cho Ngày ---
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // --- Helper format riêng cho Giờ ---
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="items-center pb-0">
          <CardTitle>Bài nộp gần đây</CardTitle>
        </CardHeader>
        <div className='p-4 mx-auto overflow-x-auto w-full'>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Who</TableHead>
                <TableHead>Problem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Memory</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.shortId}>
                  <TableCell className="font-mono text-muted-foreground">
                    {submission.shortId}
                  </TableCell>

                  {/* --- UPDATE: Tách Ngày/Giờ thành 2 dòng --- */}
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                            {formatDate(submission.createdAt)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {formatTime(submission.createdAt)}
                        </span>
                    </div>
                  </TableCell>

                  {/* --- UPDATE: Nhấn mạnh người nộp --- */}
                  <TableCell className="font-semibold text-primary">
                    {submission.user?.userName || "Unknown"}
                  </TableCell>

                  {/* --- UPDATE: Nhấn mạnh tên bài tập --- */}
                  <TableCell className="font-medium">
                    {submission.problem?.name || "Unknown"}
                  </TableCell>

                  <TableCell>
                    {getStatusBadge(submission.status)}
                  </TableCell>
                  <TableCell>{submission.time}</TableCell>
                  <TableCell>{submission.memory}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      </Card>
    </div>
  )
}

export default SubmissionRecent