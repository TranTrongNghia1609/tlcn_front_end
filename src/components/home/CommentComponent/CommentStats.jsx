import React from 'react';

const CommentStats = ({ totalComments = 0 }) => {
  return (
    <h3 className="font-semibold text-gray-900 mb-4">
      Comments ({totalComments})
    </h3>
  );
};

export default CommentStats;