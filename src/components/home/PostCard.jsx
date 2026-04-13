import React, { useState, useEffect } from 'react';
import PostHeader from './PostComponent/PostHeader';
import PostContent from './PostComponent/PostContent';
import PostActions from './PostComponent/PostActions';
import PostDetailModal from './PostDetailModal';
import PostEdit from './PostComponent/PostEdit';
import { useUser } from '../../context/UserContext';
import { usePost } from '../../context/PostContext';
import { useComment } from '../../context/CommentContext';
import { toast } from 'react-toastify';

const PostCard = ({ post, onUpdate, onDelete }) => {
  const { user } = useUser();
  const { toggleLike, bookmarkPost, updatePost, deletePost } = usePost(); 
  const { createComment } = useComment();
  
  const [showModal, setShowModal] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [localPost, setLocalPost] = useState(() => ({
    ...post,
    isLiked: Boolean(post.isLiked), 
    likesCount: post.likesCount || 0,
    commentsCount: post.commentsCount || 0,
    codeSnippet: post.codeSnippet || ''
  }));

  useEffect(() => {
    setLocalPost(prev => ({
      ...post,
      isLiked: Boolean(post.isLiked),
      likesCount: post.likesCount || 0,
      commentsCount: post.commentsCount || 0,
      codeSnippet: post.codeSnippet || ''
    }));
  }, [post]);

  const handleLike = async () => {
    if (!user || isLiking) return;

    const currentLikeState = Boolean(localPost.isLiked);
    const currentLikesCount = localPost.likesCount || 0;
    const newLikeState = !currentLikeState;
    const newLikesCount = newLikeState
      ? currentLikesCount + 1
      : Math.max(0, currentLikesCount - 1);

    try {
      setIsLiking(true);

      setLocalPost(prev => ({
        ...prev,
        isLiked: newLikeState,
        likesCount: newLikesCount
      }));

      const response = await toggleLike(post._id);

      if (response?.data) {
        const serverIsLiked = Boolean(response.data.isLiked);
        const serverLikesCount = response.data.likesCount || 0;

        setLocalPost(prev => ({
          ...prev,
          isLiked: serverIsLiked,
          likesCount: serverLikesCount
        }));
      }
    } catch (error) {
      console.error('PostCard toggleLike error:', error);

      setLocalPost(prev => ({
        ...prev,
        isLiked: currentLikeState,
        likesCount: currentLikesCount
      }));

      toast.error(`Không thể ${currentLikeState ? 'bỏ thích' : 'thích'} bài viết. Vui lòng thử lại.`);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để lưu bài viết');
      return;
    }

    try {
      await bookmarkPost(post._id);
      toast.success('Đã lưu bài viết');
    } catch (error) {
      console.error('Error bookmarking post:', error);
      toast.error('Không thể lưu bài viết');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: localPost.title,
        text: localPost.content.substring(0, 100) + '...',
        url: window.location.href
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép link!');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async (updateData) => {
    try {
      setIsUpdating(true);
      const updatedPost = await updatePost(post._id, updateData);
      setLocalPost(updatedPost);
      setIsEditing(false);
      toast.success('Cập nhật bài viết thành công!');
      
      if (onUpdate) {
        onUpdate(updatedPost);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Không thể cập nhật bài viết. Vui lòng thử lại.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      toast.success('Đã xóa bài viết thành công!');
      
      // Call parent onDelete callback if provided
      if (onDelete) {
        onDelete(postId);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Không thể xóa bài viết. Vui lòng thử lại.');
    }
  };

  const handleToggleComments = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCreateComment = async (content) => {
    if (!content.trim() || submitting) return;

    if (!user) {
      toast.error('Vui lòng đăng nhập để bình luận');
      return;
    }

    setSubmitting(true);
    try {
      await createComment({
        postId: post._id,
        content: content.trim(),
        parentCommentId: null
      });
      
      setLocalPost(prev => ({
        ...prev,
        commentsCount: (prev.commentsCount || 0) + 1
      }));

      if (onUpdate) {
        onUpdate({
          ...localPost,
          commentsCount: (localPost.commentsCount || 0) + 1
        });
      }
      
      toast.success('Đã đăng bình luận!');
    } catch (error) {
      toast.error(error.message || 'Không thể đăng bình luận.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isEditing) {
    return (
      <PostEdit
        post={localPost}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        isUpdating={isUpdating}
      />
    );
  }

  return (
    <>
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <PostHeader
          post={localPost}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <PostContent
          post={localPost}
          isExpanded={isExpanded}
          onToggleExpanded={handleToggleExpanded}
        />
        <PostActions
          post={localPost}
          onLike={handleLike}
          onToggleComments={handleToggleComments}
          onBookmark={handleBookmark}
          onShare={handleShare}
          showComments={false}
          isLiking={isLiking}
        />
      </article>

      <PostDetailModal
        post={localPost}
        isOpen={showModal}
        onClose={handleCloseModal}
        onLike={handleLike}
        onBookmark={handleBookmark}
        onShare={handleShare}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLiking={isLiking}
        realTimeCommentsCount={localPost.commentsCount}
        onCreateComment={handleCreateComment}
        submitting={submitting}
      />
    </>
  );
};

export default PostCard;