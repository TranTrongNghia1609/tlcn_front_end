import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { toast } from 'sonner';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  MessageSquare,
  Clock,
  TrendingUp,
  Lightbulb,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import solutionService from '@/services/solutionService';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import SolutionDetail from './SolutionDetail';

const ProblemSolutions = ({ problemShortId }) => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('votes');
  const [selectedSolutionId, setSelectedSolutionId] = useState(null);
  const navigate = useNavigate();
  const { id, solutionId } = useParams();

  useEffect(() => {
    if (problemShortId) {
      loadSolutions();
    }
  }, [problemShortId, sortBy]);

  // Sync with URL params
  useEffect(() => {
    if (solutionId) {
      setSelectedSolutionId(solutionId);
    } else {
      setSelectedSolutionId(null);
    }
  }, [solutionId]);

  const loadSolutions = async () => {
    try {
      setLoading(true);
      const response = await solutionService.getSolutionsByProblem(problemShortId, {
        sort: sortBy
      });
      
      const solutionsData = response?.data?.items || [];
      console.log('Solutions loaded:', solutionsData);
      setSolutions(solutionsData);
    } catch (error) {
      console.error('Load solutions error:', error);
      toast.error('Không thể tải solutions');
      setSolutions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSolutionClick = (solutionId) => {
    // Update URL and show detail view
    navigate(`/problemset/problem/${id}/solutions/${solutionId}`);
    setSelectedSolutionId(solutionId);
  };

  const handleBackToList = () => {
    navigate(`/problemset/problem/${id}/solutions`);
    setSelectedSolutionId(null);
  };

  const handleVote = async (solutionId, voteType, e) => {
    e.stopPropagation();
    try {
      await solutionService.voteSolution(solutionId, voteType);
      toast.success(voteType === 'upvote' ? 'Đã upvote' : 'Đã downvote');
      loadSolutions();
    } catch (error) {
      toast.error('Vui lòng đăng nhập để vote');
    }
  };

  const getApproachColor = (approach) => {
    const colors = {
      'brute-force': 'bg-gray-100 text-gray-700',
      'greedy': 'bg-green-100 text-green-700',
      'dynamic-programming': 'bg-purple-100 text-purple-700',
      'divide-conquer': 'bg-blue-100 text-blue-700',
      'backtracking': 'bg-orange-100 text-orange-700',
      'graph': 'bg-pink-100 text-pink-700',
      'tree': 'bg-emerald-100 text-emerald-700',
      'sorting': 'bg-yellow-100 text-yellow-700',
      'searching': 'bg-cyan-100 text-cyan-700',
      'math': 'bg-indigo-100 text-indigo-700',
      'string': 'bg-red-100 text-red-700',
      'array': 'bg-teal-100 text-teal-700',
      'other': 'bg-gray-100 text-gray-700'
    };
    return colors[approach] || colors.other;
  };

  const formatApproachName = (approach) => {
    return approach.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formatTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
    } catch {
      return 'vừa xong';
    }
  };

  // Show solution detail if a solution is selected
  if (selectedSolutionId) {
    return (
      <div className="h-full">
        <SolutionDetail 
          solutionId={selectedSolutionId} 
          problemShortId={problemShortId}
          onBack={handleBackToList}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4 bg-white h-full">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse border">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-12 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!solutions || solutions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white">
        <Lightbulb className="w-20 h-20 mb-4 text-gray-300" />
        <p className="text-xl font-semibold text-gray-700 mb-2">Chưa có solution nào</p>
        <p className="text-sm text-gray-500">Hãy là người đầu tiên chia sẻ solution!</p>
      </div>
    );
  }

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 border-b bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Solutions</h2>
              <Badge variant="secondary" className="ml-2">
                {solutions.length}
              </Badge>
            </div>
          </div>

          {/* Sort Tabs */}
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'votes' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('votes')}
              className="gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Top
            </Button>
            <Button
              variant={sortBy === 'recent' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('recent')}
              className="gap-2"
            >
              <Clock className="w-4 h-4" />
              Recent
            </Button>
            <Button
              variant={sortBy === 'views' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('views')}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Most Viewed
            </Button>
          </div>
        </div>
      </div>

      {/* Solutions List - Scrollable */}
      <div className="flex-1 overflow-y-auto divide-y">
        {solutions.map((solution) => (
          <div
            key={solution._id}
            className="px-6 py-5 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => handleSolutionClick(solution._id)}
          >
            <div className="flex gap-4">
              {/* Vote Section */}
              <div className="flex flex-col items-center gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-green-50"
                  onClick={(e) => handleVote(solution._id, 'upvote', e)}
                >
                  <ThumbsUp className="w-4 h-4 text-gray-600 hover:text-green-600" />
                </Button>
                
                <span className="font-semibold text-gray-900 text-lg">
                  {solution.voteScore || 0}
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-50"
                  onClick={(e) => handleVote(solution._id, 'downvote', e)}
                >
                  <ThumbsDown className="w-4 h-4 text-gray-600 hover:text-red-600" />
                </Button>
              </div>

              {/* Content Section */}
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                  {solution.title}
                </h3>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={solution.author?.avatar} />
                      <AvatarFallback className="text-xs">
                        {solution.author?.fullName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-800">
                      {solution.author?.fullName || 'Anonymous'}
                    </span>
                  </div>

                  <span className="text-gray-400">•</span>

                  {/* Time */}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTimeAgo(solution.createdAt)}
                  </span>

                  <span className="text-gray-400">•</span>

                  {/* Approach */}
                  <Badge className={`${getApproachColor(solution.approach)} text-xs`}>
                    {formatApproachName(solution.approach)}
                  </Badge>
                </div>

                {/* Complexity Tags */}
                <div className="flex gap-3 mb-3">
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 rounded text-xs">
                    <span className="text-gray-600">Time:</span>
                    <code className="font-mono font-semibold text-blue-700">
                      {solution.complexity?.time || 'N/A'}
                    </code>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 rounded text-xs">
                    <span className="text-gray-600">Space:</span>
                    <code className="font-mono font-semibold text-purple-700">
                      {solution.complexity?.space || 'N/A'}
                    </code>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {solution.viewCount || 0} views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    {solution.commentCount || 0} comments
                  </span>
                </div>

                {/* Tags */}
                {solution.tags && solution.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {solution.tags.slice(0, 3).map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs bg-gray-50 hover:bg-gray-100"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {solution.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-gray-50">
                        +{solution.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemSolutions;