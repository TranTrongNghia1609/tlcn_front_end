import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '../../context/UserContext';
import { getComments, createComment, likeComment } from '../../services/commentService';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon,
  PaperAirplaneIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const CommentSection = ({ postId, onCommentUpdate }) => {
  const { user } = useUser();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await getComments(postId);
      setComments(response.data.comments);
      onCommentUpdate(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      const response = await createComment({
        postId,
        content: newComment,
        parentId: replyTo
      });
      
      const updatedComments = [...comments, response.data.comment];
      setComments(updatedComments);
      onCommentUpdate(updatedComments);
      setNewComment('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) return;

    try {
      const response = await likeComment(commentId);
      setComments(prev => prev.map(comment => 
        comment._id === commentId ? response.data.comment : comment
      ));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const CommentItem = ({ comment, isReply = false }) => {
    const isLiked = comment.likes?.includes(user?._id);

    return (
      <div className={`${isReply ? 'ml-12' : ''}`}>
        <div className="flex space-x-3">
          <img
            src={comment.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.userName)}&size=32&background=2563eb&color=fff`}
            alt={comment.author.userName}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-sm text-gray-900">
                  {comment.author.fullName || comment.author.userName}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt))} ago
                </span>
              </div>
              
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>

            <div className="flex items-center space-x-4 mt-2">
              <button
                onClick={() => handleLikeComment(comment._id)}
                disabled={!user}
                className={`flex items-center space-x-1 text-xs ${
                  isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLiked ? (
                  <HeartSolidIcon className="w-4 h-4" />
                ) : (
                  <HeartIcon className="w-4 h-4" />
                )}
                <span>{comment.likesCount || 0}</span>
              </button>

              {user && !isReply && (
                <button
                  onClick={() => setReplyTo(comment._id)}
                  className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600"
                >
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              )}
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 space-y-3">
                {comment.replies.map(reply => (
                  <CommentItem key={reply._id} comment={reply} isReply={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="border-t border-gray-100 bg-gray-50">
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Comments ({comments.length})
        </h3>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="flex space-x-3">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&size=40&background=2563eb&color=fff`}
                alt={user.userName}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              
              <div className="flex-1">
                {replyTo && (
                  <div className="mb-2 text-sm text-gray-600">
                    Replying to comment...
                    <button
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="ml-2 text-blue-600 hover:text-blue-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                
                <div className="relative">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="3"
                    disabled={submitting}
                  />
                  
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className="absolute bottom-3 right-3 p-2 text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700">Please login to comment</p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : comments.length > 0 ? (
            comments.map(comment => (
              <CommentItem key={comment._id} comment={comment} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;