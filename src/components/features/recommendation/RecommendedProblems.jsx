import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, TrendingUp, ArrowRight, RefreshCw } from 'lucide-react';
import { recommendationService } from '@/services/recommendationService';

const difficultyConfig = {
  Easy: { label: 'Easy', color: 'bg-green-100 text-green-700 border-green-200' },
  Medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  Hard: { label: 'Hard', color: 'bg-red-100 text-red-700 border-red-200' },
};

const RecommendedProblems = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recommendationService.getRecommendedProblems(5);
      setData(response?.data || null);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      if (err?.response?.status === 401) {
        // Not logged in, don't show error
        setData(null);
      } else {
        setError('Không thể tải đề xuất');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      setData(null);
      return;
    }
    fetchRecommendations();
  }, []);

  // Not logged in or no data
  if (!loading && !data) return null;

  const recommendations = data?.recommendations || [];
  const weakTags = data?.weakTags || [];

  // No recommendations
  if (!loading && recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-800">Recommended Problems for You</h3>
          </div>

        </div>

        {/* Weak tags pills */}
        {weakTags.length > 0 && !loading && (
          <div className="mt-2 flex flex-wrap gap-1">
            {weakTags.slice(0, 4).map((wt) => (
              <span
                key={wt.tag}
                className="inline-flex items-center gap-1 rounded-full bg-blue-100/80 px-2 py-0.5 text-xs font-medium text-blue-700"
                title={wt.source === 'bkt' ? `Mức thành thạo: ${wt.masteryPercent}%` : `Sai: ${wt.failedCount} lần`}
              >
                <TrendingUp className="h-3 w-3" />
                {wt.tag}
                {wt.source === 'bkt' && wt.masteryPercent !== undefined && wt.masteryPercent !== null ? (
                  <span className="text-blue-500 font-semibold">{wt.masteryPercent}%</span>
                ) : (
                  <span className="text-blue-500">({wt.failedCount})</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-4 py-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="flex gap-2">
                <div className="h-5 bg-gray-100 rounded-full w-12" />
                <div className="h-5 bg-gray-100 rounded-full w-16" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            {error}
          </div>
        ) : (
          recommendations.map((problem) => {
            const diff = difficultyConfig[problem.difficulty] || difficultyConfig.Easy;

            return (
              <button
                key={problem._id}
                type="button"
                onClick={() => navigate(`/problemset/problem/${problem.shortId}`)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                      {problem.name}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${diff.color}`}>
                        {diff.label}
                      </span>
                      {problem.matchedTags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                        >
                          {tag}
                          {problem.masteryInfo && problem.masteryInfo[tag] !== undefined && (
                            <span className="text-gray-400 font-medium">
                              {problem.masteryInfo[tag]}%
                            </span>
                          )}
                        </span>
                      ))}
                      {problem.acceptanceRate > 0 && (
                        <span className="text-xs text-gray-400">
                          {problem.acceptanceRate}% AC
                        </span>
                      )}
                    </div>
                    {problem.reason && (
                      <div className="mt-1 text-xs text-blue-500 italic">
                        {problem.reason}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors mt-1 shrink-0" />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecommendedProblems;
