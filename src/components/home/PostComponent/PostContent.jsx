import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const PostContent = ({ post, isExpanded, onToggleExpanded }) => {
  React.useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: false,
      mangle: false,
    });
  }, [])
  const getDisplayContent = () => {
    if (post.content) {
      try {
        const rawHtml = marked(post.content);
        const sanitizedHtml = DOMPurify.sanitize(rawHtml);
        return sanitizedHtml;
      } catch (error) {
        console.error('MarkDown Convert error: ', error);
        return post.content;
      }
    }
    return '';
  };
  const getPlainText = () => {
    if (!post.content) return '';
    return post.content
      .replace(/[#*`_~\[\]()]/g, '')
      .replace(/\n/g, ' ')
      .trim();
  }
  const plainTextContent = getPlainText();
  const shouldTruncate = plainTextContent.length > 300;

  return (
    <div className="px-6 pb-4">
      <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
        {post.title}
      </h2>

      {/* ✅ Di chuyển markdown-content lên div cha có prose class */}
      <div className="prose prose-sm max-w-none text-gray-700 mb-4 markdown-content">
        {shouldTruncate && !isExpanded ? (
          <>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  marked(post.content.substring(0, 300)) || plainTextContent.substring(0, 300)
                )
              }}
              className="inline"
            />
            <span>...</span>
            <button
              onClick={onToggleExpanded}
              className="text-blue-600 hover:text-blue-700 font-medium ml-1"
            >
              Read more
            </button>
          </>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: getDisplayContent() }}
           
          />
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
  <div className={`mb-4 ${post.images.length > 1 ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : ''}`}>
    {post.images.slice(0, 4).map((image, index) => {
      const imageUrl = image.url || image;

      return (
        <div key={index} className="relative">
          <img
            src={imageUrl}
            alt={image.originalName || `Post image ${index + 1}`}
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: '100%',
              display: 'block'
            }}
            className="rounded-lg"
            onError={(e) => {
              console.error('❌ Image load error:', {
                url: imageUrl,
                image: image,
                error: e
              });
              e.target.style.display = 'none';
            }}
            onLoad={() => {
            }}
          />

         
        </div>
      );
    })}
  </div>
)}
    </div>
  );
};

export default PostContent;