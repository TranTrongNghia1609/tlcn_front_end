import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { MessageSquare, Send, Lock } from 'lucide-react';
import DiscussionCommentItem from './DiscussionCommentItem';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const DiscussionCommentSection = ({
  classCode,
  discussionId,
  comments = [],
  totalComments = 0,
  isLocked,
  allowComments,
  currentUser,
  onCommentsUpdate
}) => {
  const activeComments = comments.filter(c => c.status === 'active') || [];

  const formatTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { 
        addSuffix: true, 
        locale: vi 
      });
    } catch {
      return 'vừa xong';
    }
  };

  return (
    <Card className="mt-6 p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Bình luận ({totalComments})
      </h3>

      {isLocked && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-center">
          <Lock size={24} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">Bài viết này đã bị khóa bình luận</p>
        </div>
      )}

      {!currentUser && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">Đăng nhập để bình luận</p>
        </div>
      )}

      <Separator className="my-6" />

      {/* Comments List */}
      <div className="space-y-6">
        {activeComments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Chưa có bình luận nào</p>
            <p className="text-sm">Hãy là người đầu tiên bình luận!</p>
          </div>
        ) : (
          activeComments
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((comment) => (
              <DiscussionCommentItem
                key={comment._id}
                comment={comment}
                classCode={classCode}
                discussionId={discussionId}
                formatTimeAgo={formatTimeAgo}
                currentUser={currentUser}
                onCommentUpdated={onCommentsUpdate}
              />
            ))
        )}
      </div>
    </Card>
  );
};

export default DiscussionCommentSection;