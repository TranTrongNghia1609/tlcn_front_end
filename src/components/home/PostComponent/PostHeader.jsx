import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { EllipsisHorizontalIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useUser } from '../../../context/UserContext';

const PostHeader = ({ post, onEdit, onDelete }) => {
  const { user } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  
  const isOwner = user?._id === post.author._id;

  return (
    <div className="p-6 pb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <img
            src={post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.userName)}&size=40&background=2563eb&color=fff`}
            alt={post.author.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                {post.author.fullName || post.author.userName}
              </h3>
              <span className="text-gray-500 text-sm">@{post.author.userName}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <time>{formatDistanceToNow(new Date(post.createdAt))} ago</time>
              {post.updatedAt !== post.createdAt && (
                <>
                  <span>•</span>
                  <span className="text-gray-400 italic">edited</span>
                </>
              )}
              {post.tags && post.tags.length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex space-x-1">
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-blue-600 hover:text-blue-700 cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="text-gray-400">+{post.tags.length - 2}</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Post Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <EllipsisHorizontalIcon className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
              {isOwner ? (
                <>
                  <button 
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>Edit Post</span>
                  </button>
                  <button 
                    onClick={() => {
                      onDelete(post._id);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete Post
                  </button>
                </>
              ) : (
                <>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Report Post
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Hide Post
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostHeader;