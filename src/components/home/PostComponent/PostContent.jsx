import React from 'react';

const PostContent = ({ post, isExpanded, onToggleExpanded }) => {
  const getDisplayContent = () => {
    if (post.htmlContent) {
      return post.htmlContent;
    }
    return post.content;
  };

  return (
    <div className="px-6 pb-4">
      <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
        {post.title}
      </h2>
      
      <div className="prose prose-sm max-w-none text-gray-700 mb-4">
        {post.htmlContent ? (
          <div 
            dangerouslySetInnerHTML={{ __html: getDisplayContent() }}
            className="ql-editor"
            style={{ padding: 0 }}
          />
        ) : post.content.length > 300 && !isExpanded ? (
          <>
            {post.content.substring(0, 300)}...
            <button 
              onClick={onToggleExpanded}
              className="text-blue-600 hover:text-blue-700 font-medium ml-1"
            >
              Read more
            </button>
          </>
        ) : (
          post.content
        )}
      </div>

      {/* Code Block (if any) */}
      {post.codeSnippet && (
        <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
          <pre className="text-sm text-gray-300">
            <code>{post.codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Images (if any) */}
      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {post.images.slice(0, 4).map((image, index) => (
            <img
              key={index}
              src={image}
              alt=""
              className="rounded-lg object-cover w-full h-48"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostContent;