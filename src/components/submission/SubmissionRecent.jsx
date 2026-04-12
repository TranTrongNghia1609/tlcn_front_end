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
import TablePagination from '../common/TablePagination';
import { Skeleton } from '@/components/ui/skeleton';


const SubmissionRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
    <TableCell>
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-32" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-24 rounded-full" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-12" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
  </TableRow>
);


function SubmissionRecent({userId}) {
  const [ submissions, setSubmissions ] = useState([]);
  const [ pageActive, setPageActive ] = useState(1);
  const [ pagination, setPagination ] = useState({});
  const [ isLoading, setIsLoading ] = useState(false);
  useEffect(() => {
    const fetchSubmssion = async () => {
      setIsLoading(true);
      try {
        const response = await getSubmissionByUserId(userId, null, pageActive); 
        console.log('Fetched submissions:', {page: response.page, totalPages: response.totalPages, last: response.last});
        setPagination({page: response.data.page, totalPages: response.data.totalPages, last: response.data.last});
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
  const handlePageChange = (newPage) => {
    setPageActive(newPage);
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
              {isLoading ? (
                // Hiển thị 5 skeleton rows khi đang loading
                Array.from({ length: 5 }).map((_, index) => (
                  <SubmissionRowSkeleton key={index} />
                ))
              ) : submissions.length === 0 ? (
                // Hiển thị message khi không có data
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Không có bài nộp nào
                  </TableCell>
                </TableRow>
              ) : (
                // Hiển thị data thực tế
                submissions.map((submission) => (
                  <TableRow key={submission.shortId}>
                    <TableCell className="font-mono text-muted-foreground">
                      {submission.shortId}
                    </TableCell>

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

                    <TableCell className="font-semibold text-primary">
                      {submission.user?.userName || "Unknown"}
                    </TableCell>

                    <TableCell className="font-medium">
                      {submission.problem?.name || "Unknown"}
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(submission.status)}
                    </TableCell>
                    <TableCell>{submission.time}</TableCell>
                    <TableCell>{submission.memory}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {!isLoading && submissions.length > 0 && (
            <TablePagination
              currentPage={pageActive}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              maxVisiblePages={10}
              showFirstLast={true}
            />
          )}
        </div>
        
      </Card>
    </div>
  )
}

export default SubmissionRecent