import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ReplyItem = ({ reply, formatTimeAgo }) => {
  return (
    <div className="flex gap-2">
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={reply.user?.avatar} />
        <AvatarFallback>
          {reply.user?.fullName?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-xs">
            {reply.user?.fullName || 'Anonymous'}
          </span>
          <span className="text-xs text-gray-500">
            {formatTimeAgo(reply.createdAt)}
          </span>
          {reply.isEdited && (
            <span className="text-xs text-gray-400 italic">(đã chỉnh sửa)</span>
          )}
        </div>
        <p className="text-gray-700 text-xs leading-relaxed">
          {reply.content}
        </p>
      </div>
    </div>
  );
};

export default ReplyItem;