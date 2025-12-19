import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ThumbsUp, Send, ChevronDown, ChevronUp } from 'lucide-react';
import discussionService from '@/services/discussionService';
import DiscussionReplyItem from './DiscussionReplyItem';

const DiscussionCommentItem = ({ 
  comment, 
  classCode,
  discussionId,
  formatTimeAgo, 
  currentUser, 
  onCommentUpdated 
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes?.length || 0);

  // Initialize like status
  useEffect(() => {
    if (currentUser && comment.likes) {
      const userId = currentUser._id || currentUser.id;
      setIsLiked(comment.likes.some(like => {
        const likeUserId = like.user || like;
        return likeUserId === userId || likeUserId?.toString() === userId?.toString();
      }));
    }
  }, [comment, currentUser]);

  const handleToggleLike = async () => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để thích bình luận');
      return;
    }

    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);

      await discussionService.toggleCommentLike(classCode, discussionId, comment._id);
      toast.success(newIsLiked ? 'Đã thích bình luận' : 'Đã bỏ thích');
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikeCount(comment.likes?.length || 0);
      console.error('❌ Toggle like error:', error);
      toast.error('Không thể thực hiện thao tác');
    }
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) {
      toast.error('Vui lòng nhập reply');
      return;
    }

    try {
      setSubmittingReply(true);
      await discussionService.addReply(classCode, discussionId, comment._id, { 
        content: replyContent 
      });
      toast.success('Đã thêm reply');
      setReplyContent('');
      setShowReplyBox(false);
      setShowReplies(true);
      
      if (onCommentUpdated) {
        onCommentUpdated();
      }
    } catch (error) {
      console.error('❌ Submit reply error:', error);
      toast.error('Không thể thêm reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className="space-y-3">
      {/* Main Comment */}
      <div className="flex gap-3">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={comment.author?.avatar} />
          <AvatarFallback>
            {comment.author?.fullName?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          {/* User Info */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">
              {comment.author?.fullName || comment.author?.userName || 'Anonymous'}
            </span>
            <span className="text-xs text-gray-500">
              {formatTimeAgo(comment.createdAt)}
            </span>
            {comment.isEdited && (
              <span className="text-xs text-gray-400 italic">(đã chỉnh sửa)</span>
            )}
          </div>

          {/* Comment Content */}
          <p className="text-gray-700 text-sm leading-relaxed mb-2 whitespace-pre-wrap">
            {comment.content}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Like Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2 ${
                isLiked
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={handleToggleLike}
            >
              <ThumbsUp className={`w-3 h-3 mr-1 ${isLiked ? 'fill-blue-600' : ''}`} />
              {likeCount > 0 && likeCount}
            </Button>

            <span className="text-gray-300 mx-1">|</span>

            {/* Reply Button */}
            {currentUser && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setShowReplyBox(!showReplyBox)}
              >
                Reply
              </Button>
            )}

            {/* Show/Hide Replies */}
            {hasReplies && (
              <>
                <span className="text-gray-300 mx-1">|</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setShowReplies(!showReplies)}
                >
                  {showReplies ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      Ẩn {comment.replies.length} reply
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      Hiện {comment.replies.length} reply
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Reply Box */}
          {showReplyBox && currentUser && (
            <div className="mt-3 pl-4 border-l-2 border-gray-200">
              <div className="flex gap-2">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>
                    {currentUser.fullName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Viết reply của bạn..."
                    className="min-h-[80px] text-sm"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={handleSubmitReply}
                      disabled={submittingReply || !replyContent.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      {submittingReply ? 'Đang gửi...' : 'Gửi'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowReplyBox(false);
                        setReplyContent('');
                      }}
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Replies List */}
          {showReplies && hasReplies && (
            <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-200">
              {comment.replies.map((reply) => (
                <DiscussionReplyItem
                  key={reply._id}
                  reply={reply}
                  classCode={classCode}
                  discussionId={discussionId}
                  commentId={comment._id}
                  formatTimeAgo={formatTimeAgo}
                  currentUser={currentUser}
                  onReplyUpdated={onCommentUpdated}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionCommentItem;