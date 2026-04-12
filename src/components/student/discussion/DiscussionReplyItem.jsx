import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { ThumbsUp } from 'lucide-react';
import discussionService from '@/services/discussionService';

const DiscussionReplyItem = ({ 
  reply, 
  classCode,
  discussionId,
  commentId,
  formatTimeAgo,
  currentUser,
  onReplyUpdated
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(reply.likes?.length || 0);

  // Initialize like status
  useEffect(() => {
    if (currentUser && reply.likes) {
      const userId = currentUser._id || currentUser.id;
      setIsLiked(reply.likes.some(like => {
        const likeUserId = like.user || like;
        return likeUserId === userId || likeUserId?.toString() === userId?.toString();
      }));
    }
  }, [reply, currentUser]);

  const handleToggleLike = async () => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để thích reply');
      return;
    }

    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);

      await discussionService.toggleReplyLike(classCode, discussionId, commentId, reply._id);
      toast.success(newIsLiked ? 'Đã thích reply' : 'Đã bỏ thích');
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikeCount(reply.likes?.length || 0);
      console.error('❌ Toggle like error:', error);
      toast.error('Không thể thực hiện thao tác');
    }
  };

  return (
    <div className="flex gap-2">
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={reply.author?.avatar} />
        <AvatarFallback>
          {reply.author?.fullName?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-xs">
            {reply.author?.fullName || reply.author?.userName || 'Anonymous'}
          </span>
          <span className="text-xs text-gray-500">
            {formatTimeAgo(reply.createdAt)}
          </span>
          {reply.isEdited && (
            <span className="text-xs text-gray-400 italic">(đã chỉnh sửa)</span>
          )}
        </div>
        <p className="text-gray-700 text-xs leading-relaxed mb-1 whitespace-pre-wrap">
          {reply.content}
        </p>

        {/* Like Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 px-2 text-xs ${
            isLiked
              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={handleToggleLike}
        >
          <ThumbsUp className={`w-3 h-3 mr-1 ${isLiked ? 'fill-blue-600' : ''}`} />
          {likeCount > 0 && likeCount}
        </Button>
      </div>
    </div>
  );
};

export default DiscussionReplyItem;