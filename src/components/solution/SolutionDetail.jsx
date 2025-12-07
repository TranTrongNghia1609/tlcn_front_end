import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/atom-one-dark.css';
import 'katex/dist/katex.min.css';
import {
  ThumbsUp,
  ThumbsDown,
  Eye,
  MessageSquare,
  ArrowLeft,
  Code2
} from 'lucide-react';
import solutionService from '@/services/solutionService';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import CommentSectionSolutions from './CommentSectionSolutions';

const SolutionDetail = ({ solutionId, problemShortId, onBack }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    if (solutionId) {
      loadSolution();
    }
  }, [solutionId]);

  const loadSolution = async () => {
    try {
      setLoading(true);
      const response = await solutionService.getSolutionById(solutionId);
      const solutionData = response.data;
      
      setSolution(solutionData);
      setUserVote(solutionData.userVote || null);
      
      console.log('✅ Solution loaded:', {
        id: solutionData._id,
        userVote: solutionData.userVote,
        upvoteCount: solutionData.upvoteCount,
        downvoteCount: solutionData.downvoteCount,
        totalComments: solutionData.totalComments
      });
    } catch (error) {
      console.error('❌ Load solution error:', error);
      toast.error('Không thể tải solution');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(`/problemset/problem/${problemShortId}/solutions`);
    }
  };

  const handleVote = async (voteType) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để vote');
      return;
    }

    try {
      const response = await solutionService.voteSolution(solutionId, voteType);
      
      setSolution(prev => ({
        ...prev,
        upvoteCount: response.data.upvoteCount,
        downvoteCount: response.data.downvoteCount,
        voteScore: response.data.voteScore
      }));
      
      setUserVote(response.data.userVote);
      
      const message = response.data.userVote 
        ? (response.data.userVote === 'upvote' ? 'Đã upvote' : 'Đã downvote')
        : 'Đã bỏ vote';
      
      toast.success(message);
    } catch (error) {
      console.error('❌ Vote error:', error);
      toast.error(error.response?.data?.message || 'Không thể vote');
    }
  };

  const handleCommentCountUpdate = (newCount) => {
    setSolution(prev => ({
      ...prev,
      totalComments: newCount
    }));
  };

  const getApproachColor = (approach) => {
    const colors = {
      'brute-force': 'bg-gray-100 text-gray-800',
      'greedy': 'bg-green-100 text-green-800',
      'dynamic-programming': 'bg-purple-100 text-purple-800',
      'divide-conquer': 'bg-blue-100 text-blue-800',
      'backtracking': 'bg-orange-100 text-orange-800',
      'graph': 'bg-pink-100 text-pink-800',
      'tree': 'bg-emerald-100 text-emerald-800',
      'sorting': 'bg-yellow-100 text-yellow-800',
      'searching': 'bg-cyan-100 text-cyan-800',
      'math': 'bg-indigo-100 text-indigo-800',
      'string': 'bg-red-100 text-red-800',
      'array': 'bg-teal-100 text-teal-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[approach] || colors.other;
  };

  const formatTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
    } catch {
      return 'vừa xong';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải solution...</p>
        </div>
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="flex items-center justify-center h-96 bg-white">
        <p className="text-gray-500">Không tìm thấy solution</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 bg-white border-b">
        <div className="px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mb-4 cursor-pointer" 
          >
            <ArrowLeft className="w-4 h-4 mr-2 " />
            Quay lại Solutions
          </Button>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {solution.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={solution.author?.avatar} />
                <AvatarFallback>
                  {solution.author?.fullName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">
                  {solution.author?.fullName || 'Anonymous'}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTimeAgo(solution.createdAt)}
                </p>
              </div>
            </div>

            <Separator orientation="vertical" className="h-8" />

            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {solution.viewCount || 0}
            </div>

            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {solution.totalComments || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 pb-24">
          <div className="space-y-6">
            {/* Solution Content Card */}
            <Card className="p-6">
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className={getApproachColor(solution.approach)}>
                  {solution.approach.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </Badge>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-md border border-blue-200">
                  <span className="text-sm text-gray-700">Time:</span>
                  <code className="font-mono font-semibold text-blue-700 text-sm">
                    {solution.complexity?.time || 'N/A'}
                  </code>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 rounded-md border border-purple-200">
                  <span className="text-sm text-gray-700">Space:</span>
                  <code className="font-mono font-semibold text-purple-700 text-sm">
                    {solution.complexity?.space || 'N/A'}
                  </code>
                </div>
              </div>

              {/* Content with Same Styling as ShareMySolutionPage */}
              <style>{`
                /* Inline code styling */
                .markdown-preview code:not(pre code) {
                  background-color: rgba(253, 230, 138, 0.5);
                  color: #b45309;
                  padding: 0.15rem 0.4rem;
                  border-radius: 0.25rem;
                  font-size: 0.9em;
                  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                  font-weight: 500;
                  border: 1px solid rgba(251, 191, 36, 0.4);
                  white-space: nowrap;
                }

                /* Headers styling */
                .markdown-preview h1 {
                  font-size: 2rem;
                  font-weight: 700;
                  margin-top: 2rem;
                  margin-bottom: 1rem;
                  padding-bottom: 0.5rem;
                  border-bottom: 3px solid #3b82f6;
                  color: #111827;
                }

                .markdown-preview h2 {
                  font-size: 1.5rem;
                  font-weight: 700;
                  margin-top: 1.75rem;
                  margin-bottom: 0.75rem;
                  padding-bottom: 0.4rem;
                  border-bottom: 2px solid #e5e7eb;
                  color: #1f2937;
                }

                .markdown-preview h3 {
                  font-size: 1.25rem;
                  font-weight: 600;
                  margin-top: 1.5rem;
                  margin-bottom: 0.5rem;
                  color: #374151;
                }

                /* Paragraph and text */
                .markdown-preview p {
                  margin: 1rem 0;
                  line-height: 1.75;
                  color: #374151;
                }

                /* Lists */
                .markdown-preview ul, .markdown-preview ol {
                  margin: 1rem 0;
                  padding-left: 2rem;
                  line-height: 1.75;
                }

                .markdown-preview ul {
                  list-style-type: disc;
                }

                .markdown-preview ol {
                  list-style-type: decimal;
                  list-style-position: outside;
                }

                .markdown-preview li {
                  margin: 0.5rem 0;
                  color: #374151;
                  padding-left: 0.5rem;
                }

                .markdown-preview li::marker {
                  color: #6b7280;
                  font-weight: 600;
                }

                /* Nested lists */
                .markdown-preview ol ol {
                  list-style-type: lower-alpha;
                  margin-top: 0.25rem;
                }

                .markdown-preview ol ol ol {
                  list-style-type: lower-roman;
                }

                .markdown-preview ul ul {
                  list-style-type: circle;
                  margin-top: 0.25rem;
                }

                .markdown-preview ul ul ul {
                  list-style-type: square;
                }

                /* Links */
                .markdown-preview a {
                  color: #2563eb;
                  text-decoration: underline;
                  font-weight: 500;
                }

                .markdown-preview a:hover {
                  color: #1d4ed8;
                }

                /* Code blocks with line numbers */
                .code-block-wrapper {
                  margin: 1.5rem 0;
                  border-radius: 0.5rem;
                  overflow: hidden;
                  border: 1px solid #e5e7eb;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .code-block-header {
                  background: linear-gradient(to right, #1e293b, #334155);
                  color: white;
                  padding: 0.75rem 1rem;
                  font-size: 0.75rem;
                  font-weight: 600;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                }

                .code-block-content {
                  background: #282c34;
                  position: relative;
                  overflow-x: auto;
                }

                .code-block-content pre {
                  margin: 0 !important;
                  padding: 0 !important;
                  background: transparent !important;
                  overflow: visible !important;
                  display: flex;
                }

                .line-numbers {
                  padding: 1rem 0;
                  text-align: right;
                  user-select: none;
                  color: #636d83;
                  background: #21252b;
                  border-right: 1px solid #3e4451;
                  min-width: 3rem;
                  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                  font-size: 0.875rem;
                  line-height: 1.5;
                }

                .line-numbers span {
                  display: block;
                  padding: 0 0.75rem;
                }

                .code-content {
                  flex: 1;
                  padding: 1rem;
                  overflow-x: auto;
                }

                .code-content code {
                  background: transparent !important;
                  color: #abb2bf !important;
                  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                  font-size: 0.875rem !important;
                  line-height: 1.5 !important;
                  display: block;
                  white-space: pre;
                }

                /* Table styling */
                .markdown-preview table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 1.5rem 0;
                  border: 1px solid #e5e7eb;
                  border-radius: 0.5rem;
                  overflow: hidden;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .markdown-preview thead {
                  background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
                }

                .markdown-preview th {
                  padding: 0.75rem 1rem;
                  text-align: left;
                  font-weight: 600;
                  font-size: 0.875rem;
                  color: #374151;
                  border-bottom: 2px solid #d1d5db;
                  text-transform: uppercase;
                  letter-spacing: 0.025em;
                }

                .markdown-preview td {
                  padding: 0.75rem 1rem;
                  border-bottom: 1px solid #e5e7eb;
                  color: #4b5563;
                }

                .markdown-preview tbody tr:hover {
                  background-color: #f9fafb;
                }

                .markdown-preview tbody tr:last-child td {
                  border-bottom: none;
                }

                /* Blockquote */
                .markdown-preview blockquote {
                  border-left: 4px solid #3b82f6;
                  padding-left: 1rem;
                  margin: 1.5rem 0;
                  color: #6b7280;
                  font-style: italic;
                }

                /* Images */
                .markdown-preview img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 0.5rem;
                  margin: 1.5rem 0;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                /* Math (KaTeX) */
                .markdown-preview .katex {
                  font-size: 1.1em;
                }

                .markdown-preview .katex-display {
                  margin: 1.5rem 0;
                  overflow-x: auto;
                  overflow-y: hidden;
                }

                /* Horizontal rule */
                .markdown-preview hr {
                  border: none;
                  border-top: 2px solid #e5e7eb;
                  margin: 2rem 0;
                }

                /* Strong and emphasis */
                .markdown-preview strong {
                  font-weight: 700;
                  color: #111827;
                }

                .markdown-preview em {
                  font-style: italic;
                }
              `}</style>

              <div className="markdown-preview">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
                  components={{
                    h1({ children }) {
                      return <h1>{children}</h1>;
                    },
                    h2({ children }) {
                      return <h2>{children}</h2>;
                    },
                    h3({ children }) {
                      return <h3>{children}</h3>;
                    },
                    table({ children }) {
                      return (
                        <div className="overflow-x-auto">
                          <table>{children}</table>
                        </div>
                      );
                    },
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      
                      if (!inline && match) {
                        const code = String(children).replace(/\n$/, '');
                        const lines = code.split('\n');
                        const lineNumbers = lines.map((_, i) => i + 1);

                        return (
                          <div className="code-block-wrapper">
                            <div className="code-block-header">
                              <Code2 className="w-4 h-4" />
                              {match[1].toUpperCase()}
                            </div>
                            <div className="code-block-content">
                              <pre>
                                <div className="line-numbers">
                                  {lineNumbers.map(num => (
                                    <span key={num}>{num}</span>
                                  ))}
                                </div>
                                <div className="code-content">
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </div>
                              </pre>
                            </div>
                          </div>
                        );
                      }

                      return inline ? (
                        <code {...props}>{children}</code>
                      ) : (
                        <code className={className} {...props}>{children}</code>
                      );
                    }
                  }}
                >
                  {solution.content}
                </ReactMarkdown>
              </div>

              {/* Tags */}
              {solution.tags && solution.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex flex-wrap gap-2">
                    {solution.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs hover:bg-gray-200 cursor-pointer"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Comments Section */}
            <CommentSectionSolutions
              solutionId={solutionId}
              user={user}
              onCommentCountUpdate={handleCommentCountUpdate}
            />
          </div>
        </div>
      </div>

      {/* Sticky Footer Bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t shadow-lg z-10">
        <div className="px-6 py-3">
          <div className="flex items-center gap-4">
            {/* Vote buttons */}
            <Button
              variant={userVote === 'upvote' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleVote('upvote')}
              className={`gap-2 ${
                userVote === 'upvote' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'hover:bg-green-50 hover:text-green-600 hover:border-green-300'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="font-semibold">{solution.voteScore || 0}</span>
            </Button>

            <Button
              variant={userVote === 'downvote' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleVote('downvote')}
              className={`gap-2 ${
                userVote === 'downvote' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'hover:bg-red-50 hover:text-red-600 hover:border-red-300'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-8" />

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">{solution.totalComments || 0}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span className="font-medium">{solution.viewCount || 0}</span>
            </div>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default SolutionDetail;