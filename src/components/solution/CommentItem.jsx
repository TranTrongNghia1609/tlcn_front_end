import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from 'sonner';
import { ThumbsUp, ThumbsDown, Send, ChevronDown, ChevronUp } from 'lucide-react';
import solutionService from '@/services/solutionService';
import ReplyItem from './ReplyItem';

const CommentItem = ({ comment, solutionId, formatTimeAgo, currentUser, onCommentUpdated }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [voteCount, setVoteCount] = useState({
    upvotes: comment.votes?.upvotes?.length || 0,
    downvotes: comment.votes?.downvotes?.length || 0
  });

  // Initialize user vote status
  useEffect(() => {
    if (currentUser && comment.votes) {
      const userId = currentUser._id || currentUser.id;
      if (comment.votes.upvotes?.some(id => id === userId || id.toString() === userId)) {
        setUserVote('upvote');
      } else if (comment.votes.downvotes?.some(id => id === userId || id.toString() === userId)) {
        setUserVote('downvote');
      }
    }
  }, [comment, currentUser]);

  const handleVoteComment = async (voteType) => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để vote');
      return;
    }

    try {
      const response = await solutionService.voteComment(solutionId, comment._id, voteType);
      
      setVoteCount({
        upvotes: response.data.upvotes || 0,
        downvotes: response.data.downvotes || 0
      });

      // Update user vote status
      if (userVote === voteType) {
        setUserVote(null); // Remove vote if clicking same button
      } else {
        setUserVote(voteType);
      }

      toast.success('Vote thành công');
    } catch (error) {
      console.error('❌ Vote comment error:', error);
      toast.error('Không thể vote comment');
    }
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) {
      toast.error('Vui lòng nhập reply');
      return;
    }

    try {
      setSubmittingReply(true);
      await solutionService.addReply(solutionId, comment._id, { content: replyContent });
      toast.success('Đã thêm reply');
      setReplyContent('');
      setShowReplyBox(false);
      setShowReplies(true);
      
      if (onCommentUpdated) {
        onCommentUpdated();
      }
      console.log(currentUser);
    } catch (error) {
      console.error('❌ Submit reply error:', error);
      toast.error('Không thể thêm reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const voteScore = voteCount.upvotes - voteCount.downvotes;
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
              {comment.author?.fullName || 'Anonymous'}
            </span>
            <span className="text-xs text-gray-500">
              {formatTimeAgo(comment.createdAt)}
            </span>
            {comment.isEdited && (
              <span className="text-xs text-gray-400 italic">(đã chỉnh sửa)</span>
            )}
          </div>

          {/* Comment Content */}
          <p className="text-gray-700 text-sm leading-relaxed mb-2">
            {comment.content}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Upvote */}
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2 ${
                userVote === 'upvote'
                  ? 'bg-green-50 text-green-600 hover:bg-green-100 cursor-pointer'
                  : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
              }`}
              onClick={() => handleVoteComment('upvote')}
            >
              <ThumbsUp className={`w-3 h-3 mr-1 ${userVote === 'upvote' ? 'fill-green-600' : ''}`} />
              {voteCount.upvotes > 0 && voteCount.upvotes}
            </Button>

            {/* Downvote */}
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2 ${
                userVote === 'downvote'
                  ? 'bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer'
                  : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
              }`}
              onClick={() => handleVoteComment('downvote')}
            >
              <ThumbsDown className={`w-3 h-3 mr-1 ${userVote === 'downvote' ? 'fill-red-600' : ''}`} />
              {voteCount.downvotes > 0 && voteCount.downvotes}
            </Button>

            <span className="text-gray-300 mx-1">|</span>

            {/* Vote Score */}
            <span className={`text-xs font-semibold px-2 ${
              voteScore > 0 ? 'text-green-600' : voteScore < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {voteScore > 0 ? '+' : ''}{voteScore}
            </span>

            <span className="text-gray-300 mx-1">|</span>

            {/* Reply Button */}
            {currentUser && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs cursor-pointer"
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
                      <ChevronUp className="w-3 h-3 mr-1 cursor-pointer" />
                      Ẩn {comment.replies.length} reply
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1 cursor-pointer" />
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
                      className="bg-green-600 hover:bg-green-700 cursor-pointer"
                      size="sm"
                      onClick={handleSubmitReply}
                      disabled={submittingReply || !replyContent.trim()}
                    >
                      <Send className="w-3 h-3 mr-1" />
                      {submittingReply ? 'Đang gửi...' : 'Gửi'}
                    </Button>
                    <Button
                      className="cursor-pointer"
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
                <ReplyItem
                  key={reply._id}
                  reply={reply}
                  formatTimeAgo={formatTimeAgo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;