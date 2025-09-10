// src/components/home/PostCard.jsx
import React, { useState } from 'react';
import PostHeader from './PostComponent/PostHeader';
import PostContent from './PostComponent/PostContent';
import PostActions from './PostComponent/PostActions';
//import PostEdit from './PostComponent/PostEdit';
import CommentSection from './CommentSection';
import { useUser } from '../../context/UserContext';
//import { likePost, bookmarkPost, updatePost } from '../../services/postService';

const PostCard = ({ post, onUpdate, onDelete }) => {
  // const { user } = useUser();
  // const [showComments, setShowComments] = useState(false);
  // const [isLiking, setIsLiking] = useState(false);
  // const [isEditing, setIsEditing] = useState(false);
  // const [isExpanded, setIsExpanded] = useState(false);
  // const [isUpdating, setIsUpdating] = useState(false);

  // const handleLike = async () => {
  //   if (!user || isLiking) return;
    
  //   try {
  //     setIsLiking(true);
  //     const response = await likePost(post._id);
  //     onUpdate(response.data.post);
  //   } catch (error) {
  //     console.error('Error liking post:', error);
  //   } finally {
  //     setIsLiking(false);
  //   }
  // };

  // const handleBookmark = async () => {
  //   if (!user) return;
    
  //   try {
  //     const response = await bookmarkPost(post._id);
  //     onUpdate(response.data.post);
  //   } catch (error) {
  //     console.error('Error bookmarking post:', error);
  //   }
  // };

  // const handleShare = async () => {
  //   try {
  //     await navigator.share({
  //       title: post.title,
  //       text: post.content.substring(0, 100) + '...',
  //       url: window.location.href
  //     });
  //   } catch (error) {
  //     // Fallback to copy link
  //     navigator.clipboard.writeText(window.location.href);
  //     alert('Link copied to clipboard!');
  //   }
  // };

  // const handleEdit = () => {
  //   setIsEditing(true);
  // };

  // const handleCancelEdit = () => {
  //   setIsEditing(false);
  // };

  // const handleSaveEdit = async (updateData) => {
  //   try {
  //     setIsUpdating(true);
  //     const response = await updatePost(post._id, updateData);
  //     onUpdate(response.data.post);
  //     setIsEditing(false);
  //   } catch (error) {
  //     console.error('Error updating post:', error);
  //     alert('Failed to update post. Please try again.');
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };

  // const handleToggleComments = () => {
  //   setShowComments(!showComments);
  // };

  // const handleToggleExpanded = () => {
  //   setIsExpanded(!isExpanded);
  // };

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
            post={post}
            onEdit={handleEdit}
            onDelete={onDelete}
          />
          
          <PostContent 
            post={post}
            isExpanded={isExpanded}
            onToggleExpanded={handleToggleExpanded}
          />
          
          <PostActions 
            post={post}
            onLike={handleLike}
            onToggleComments={handleToggleComments}
            onBookmark={handleBookmark}
            onShare={handleShare}
            showComments={showComments}
            isLiking={isLiking}
          />
          
          {showComments && (
            <CommentSection
              postId={post._id}
              comments={post.comments}
              onCommentUpdate={(comments) => onUpdate({ ...post, comments, commentsCount: comments.length })}
            />
          )}
        </>
      )}
    </article>
  );
};

export default PostCard;