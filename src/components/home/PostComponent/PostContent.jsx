import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import PostImageSlideshow from './PostImageSlideshow';

const PostContent = ({ post, isExpanded = false, onToggleExpanded }) => {
  if (!post) return null;

  const { content, codeSnippet, images } = post;
  const MAX_LENGTH = 300;
  const shouldTruncate = !isExpanded && content && content.length > MAX_LENGTH;
  const displayContent = shouldTruncate
    ? `${content.substring(0, MAX_LENGTH)}...`
    : content;

  return (
    <div className="px-6">
      {/* Images Slideshow */}
      {images && images.length > 0 && (
        <div className="mb-4 -mx-6">
          <PostImageSlideshow images={images} />
        </div>
      )}

      {/* Markdown Content */}
      {content && (
        <div className="space-y-2 mb-4">
          <div className="prose prose-sm max-w-none text-gray-800">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom rendering for code blocks
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg my-2"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600" {...props}>
                      {children}
                    </code>
                  );
                },
                // Style for paragraphs
                p: ({ children }) => (
                  <p className="mb-3 text-gray-800 leading-relaxed">{children}</p>
                ),
                // Style for headings
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold mb-3 mt-4 text-gray-900">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold mb-2 mt-4 text-gray-900">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold mb-2 mt-3 text-gray-900">{children}</h3>
                ),
                // Style for lists - FIX: Không dùng list-inside
                ul: ({ children }) => (
                  <ul className="list-disc ml-6 mb-3 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal ml-6 mb-3 space-y-1">{children}</ol>
                ),
                // Style for list items - giữ text liền với bullet
                li: ({ children }) => (
                  <li className="text-gray-800 leading-relaxed pl-2">
                    <span className="inline">{children}</span>
                  </li>
                ),
                // Style for links
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    {children}
                  </a>
                ),
                // Style for blockquotes
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-3 bg-blue-50 text-gray-700 italic">
                    {children}
                  </blockquote>
                ),
                // Style for tables
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3">
                    <table className="min-w-full divide-y divide-gray-200 border">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-50">{children}</thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-2 text-sm text-gray-800 border">{children}</td>
                ),
                // Style for horizontal rule
                hr: () => <hr className="my-4 border-gray-300" />,
                // Strong/Bold
                strong: ({ children }) => (
                  <strong className="font-bold">{children}</strong>
                ),
                // Emphasis/Italic
                em: ({ children }) => (
                  <em className="italic">{children}</em>
                ),
              }}
            >
              {shouldTruncate ? displayContent : content}
            </ReactMarkdown>
          </div>

          {content.length > MAX_LENGTH && onToggleExpanded && (
            <button
              onClick={onToggleExpanded}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            </button>
          )}
        </div>
      )}

      {/* Code Snippet Section */}
      {codeSnippet && codeSnippet.trim() && (
        <div className="mt-4">
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <span className="text-sm text-gray-300 font-medium">Code</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(codeSnippet);
                }}
                className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
              >
                Copy
              </button>
            </div>
            <SyntaxHighlighter
              language="javascript"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: '1rem',
                background: 'transparent',
                fontSize: '0.875rem',
              }}
              showLineNumbers
            >
              {codeSnippet}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostContent;