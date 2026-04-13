import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from 'sonner';
import { MessageSquare, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import solutionService from '@/services/solutionService';
import CommentItem from './CommentItem';

const CommentSectionSolutions = ({ 
  solutionId,
  user,
  onCommentCountUpdate
}) => {
  const [comments, setComments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    loadComments(1);
  }, [solutionId]);

  const loadComments = async (page = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await solutionService.getSolutionComments(solutionId, {
        page,
        limit: 10
      });
      console.log(response)
      if (page === 1) {
        setComments(response.data.comments);
      } else {
        setComments(prev => [...prev, ...response.data.comments]);
      }

      setPagination(response.data.pagination);
      setCurrentPage(page);

      // Update parent comment count
      if (onCommentCountUpdate) {
        onCommentCountUpdate(response.data.pagination.totalComments);
      }

      
    } catch (error) {
      console.error('❌ Load comments error:', error);
      toast.error('Không thể tải comments');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const formatTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
    } catch {
      return 'vừa xong';
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error('Vui lòng nhập comment');
      return;
    }

    try {
      setSubmittingComment(true);
      await solutionService.addComment(solutionId, { content: newComment });
      toast.success('Đã thêm comment');
      setNewComment('');
      
      // Reload comments from page 1
      loadComments(1);
    } catch (error) {
      console.error('❌ Submit comment error:', error);
      toast.error('Không thể thêm comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLoadMore = () => {
    loadComments(currentPage + 1);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải comments...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Comments ({pagination?.totalComments || 0})
      </h3>

      {/* Add Comment Form */}
      {user ? (
        <div className="mb-6">
          <div className="flex gap-3 mb-3">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                {user.fullName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              className="bg-green-600 hover:bg-green-700 cursor-pointer"
              onClick={handleSubmitComment}
              disabled={submittingComment || !newComment.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              {submittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">Đăng nhập để thảo luận</p>
        </div>
      )}

      <Separator className="my-6" />

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Chưa có comment nào. Hãy là người đầu tiên!
          </p>
        ) : (
          <>
            {comments.map((comment) => (
              <CommentItem 
                key={comment._id} 
                comment={comment}
                solutionId={solutionId}
                formatTimeAgo={formatTimeAgo}
                currentUser={user}
                onCommentUpdated={() => loadComments(1)}
              />
            ))}

            {/* Load More Button */}
            {pagination?.hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Đang tải...
                    </>
                  ) : (
                    <>
                      Xem thêm comments ({pagination.totalComments - comments.length} còn lại)
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default CommentSectionSolutions;