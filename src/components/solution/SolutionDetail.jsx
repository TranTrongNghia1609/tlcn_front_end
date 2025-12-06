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
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github.css';
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
      
      console.log('✅ Vote updated:', {
        userVote: response.data.userVote,
        upvoteCount: response.data.upvoteCount,
        downvoteCount: response.data.downvoteCount
      });
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

              {/* Content with Styling */}
              <style>{`
                .solution-content {
                  color: #374151;
                  line-height: 1.75;
                }
                .solution-content h1 {
                  font-size: 1.875rem;
                  font-weight: 700;
                  margin: 1.5rem 0 1rem;
                  color: #111827;
                  border-bottom: 3px solid #3b82f6;
                  padding-bottom: 0.5rem;
                }
                .solution-content h2 {
                  font-size: 1.5rem;
                  font-weight: 700;
                  margin: 1.25rem 0 0.75rem;
                  padding-bottom: 0.5rem;
                  border-bottom: 2px solid #e5e7eb;
                  color: #111827;
                }
                .solution-content h3 {
                  font-size: 1.25rem;
                  font-weight: 600;
                  margin: 1rem 0 0.5rem;
                  color: #1f2937;
                }
                .solution-content p {
                  margin: 0.75rem 0;
                  line-height: 1.8;
                }
                .solution-content ul, .solution-content ol {
                  list-style-position: outside;
                  padding-left: 2rem;
                  margin: 0.75rem 0;
                }
                .solution-content ul { list-style-type: disc; }
                .solution-content ol { list-style-type: decimal; }
                .solution-content li {
                  margin: 0.5rem 0;
                  padding-left: 0.5rem;
                  line-height: 1.8;
                }
                .solution-content li p {
                  display: inline;
                  margin: 0;
                }
                .solution-content strong {
                  font-weight: 600;
                  color: #111827;
                }
                .solution-content code:not(pre code) {
                  background-color: #fef3c7;
                  color: #b91c1c;
                  padding: 0.15rem 0.4rem;
                  border-radius: 0.25rem;
                  font-size: 0.875em;
                  font-family: 'Consolas', 'Monaco', monospace;
                  font-weight: 500;
                  border: 1px solid #fbbf24;
                }
                .solution-content pre {
                  margin: 1.25rem 0;
                  border-radius: 0.5rem;
                  overflow: hidden;
                  border: 1px solid #e5e7eb;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .solution-content pre code {
                  display: block;
                  padding: 1.25rem;
                  overflow-x: auto;
                  font-size: 0.875rem;
                  line-height: 1.7;
                  font-family: 'Consolas', 'Monaco', monospace;
                  background-color: #f9fafb;
                }
              `}</style>

              <div className="solution-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline ? (
                        <div className="relative">
                          {match && (
                            <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-2.5 text-xs font-semibold uppercase flex items-center gap-2">
                              <Code2 className="w-4 h-4" />
                              {match[1]}
                            </div>
                          )}
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </div>
                      ) : (
                        <code {...props}>{children}</code>
                      );
                    },
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