import React, { useEffect, useRef, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '../../context/UserContext';
import PostHeader from './PostComponent/PostHeader';
import PostContent from './PostComponent/PostContent';
import PostActions from './PostComponent/PostActions';
import CommentSection from './CommentSection';
import { CommentForm } from './CommentComponent';

const PostDetailModal = ({ 
  post, 
  isOpen, 
  onClose,
  onLike,
  onBookmark,
  onShare,
  onEdit,
  onDelete,
  isLiking,
  realTimeCommentsCount,
  onCreateComment,
  submitting
}) => {
  const modalRef = useRef(null);
  const { user } = useUser();
  const [mentionUser, setMentionUser] = useState(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
      
      if (post?.author && post.author.userName !== user?.userName) {
        setMentionUser(post.author);
      }
    } else {
      setMentionUser(null);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, post?.author, user?.userName]);

  if (!isOpen) return null;

  const mentionDisplayName = mentionUser?.fullName || mentionUser?.userName;
  const authorName = post?.author?.fullName || post?.author?.userName || 'Unknown User';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-20">
      <div 
        ref={modalRef}
        className="relative bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
          {/* Empty div for spacing */}
          <div className="w-10"></div>
          
          {/* Title - Centered */}
          <h2 className="text-lg font-semibold text-gray-900 text-center flex-1">
            Bài viết của {authorName}
          </h2>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="bg-white">
            <PostHeader
              post={post}
              onEdit={onEdit}
              onDelete={onDelete}
            />
            
            <PostContent
              post={post}
              isExpanded={true}
            />
            
            <PostActions
              post={{
                ...post,
                commentsCount: realTimeCommentsCount
              }}
              onLike={onLike}
              onToggleComments={() => {}}
              onBookmark={onBookmark}
              onShare={onShare}
              showComments={true}
              isLiking={isLiking}
              hideCommentButton={true}
            />
            
            <CommentSection 
              postId={post._id}
              hideCommentForm={true}
            />
          </div>
        </div>

        <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white p-4 rounded-b-lg">
          {user ? (
            <CommentForm
              onSubmit={onCreateComment}
              placeholder={mentionDisplayName ? `Reply to ${mentionDisplayName}...` : "Write a comment..."}
              submitting={submitting}
              size="normal"
              user={user}
              mentionUser={mentionUser}
            />
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 text-sm">
                Please{' '}
                <button
                  className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  onClick={() => window.location.href = '/login'}
                >
                  login
                </button>
                {' '}to post a comment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;