import React, { useState, useEffect } from 'react';
import PostHeader from './PostComponent/PostHeader';
import PostContent from './PostComponent/PostContent';
import PostActions from './PostComponent/PostActions';
import CommentSection from './CommentSection';
import { useUser } from '../../context/UserContext';
import { usePost } from '../../context/PostContext';
import { useComment } from '../../context/CommentContext';

const PostCard = ({ post, onUpdate, onDelete }) => {
  const { user } = useUser();

  // Use toggleLike instead of likePost
  const { toggleLike, bookmarkPost, updatePost } = usePost();

  const { getPostComments, getCommentsCount, loadPostComments } = useComment();
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [localPost, setLocalPost] = useState(() => ({
    ...post,
    isLiked: Boolean(post.isLiked), 
    likesCount: post.likesCount || 0
  }));

  useEffect(() => {
    setLocalPost(prev => ({
      ...post,
      isLiked: Boolean(post.isLiked),
      likesCount: post.likesCount || 0
    }));
  }, [post]);

  useEffect(() => {
    if (post._id) {
      loadPostComments(post._id);
    }
  }, [post._id, loadPostComments]);

  const contextCommentsCount = getCommentsCount(post._id);
  const realTimeCommentsCount = contextCommentsCount !== undefined
    ? contextCommentsCount
    : localPost.commentsCount || 0;

  //  Use toggleLike - much simpler!
  const handleLike = async () => {
    if (!user || isLiking) return;

    const currentLikeState = Boolean(localPost.isLiked);
    const currentLikesCount = localPost.likesCount || 0;

    // Calculate optimistic new state
    const newLikeState = !currentLikeState;
    const newLikesCount = newLikeState
      ? currentLikesCount + 1
      : Math.max(0, currentLikesCount - 1);

    

    try {
      setIsLiking(true);

      // ✅ Optimistic update
      setLocalPost(prev => ({
        ...prev,
        isLiked: newLikeState,
        likesCount: newLikesCount
      }));

      // ✅ Call API
      const response = await toggleLike(post._id);


      // ✅ Update with server response (authoritative)
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
      console.error('❌ PostCard toggleLike error:', error);

      // Revert optimistic update
      setLocalPost(prev => ({
        ...prev,
        isLiked: currentLikeState,
        likesCount: currentLikesCount
      }));

      alert(`Failed to ${currentLikeState ? 'unlike' : 'like'} post. Please try again.`);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) return;

    try {
      await bookmarkPost(post._id);
    } catch (error) {
      console.error('Error bookmarking post:', error);
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
      alert('Link copied to clipboard!');
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
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {false && isEditing ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">Edit feature is temporarily disabled</p>
          <button
            onClick={handleCancelEdit}
            className="mt-2 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <PostHeader
            post={localPost}
            onEdit={handleEdit}
            onDelete={onDelete}
          />
          <PostContent
            post={localPost}
            isExpanded={isExpanded}
            onToggleExpanded={handleToggleExpanded}
          />
          <PostActions
            post={{
              ...localPost,
              commentsCount: realTimeCommentsCount
            }}
            onLike={handleLike} // This now calls toggleLike
            onToggleComments={handleToggleComments}
            onBookmark={handleBookmark}
            onShare={handleShare}
            showComments={showComments}
            isLiking={isLiking}
          />
          {showComments && (
            <CommentSection
              postId={post._id}
            />
          )}
        </>
      )}
    </article>
  );
};

export default PostCard;