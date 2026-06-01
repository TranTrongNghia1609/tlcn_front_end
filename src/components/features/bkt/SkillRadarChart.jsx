import React, { useState, useEffect, useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Brain, TrendingUp, Award, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { bktService } from '@/services/bktService';

/**
 * Color helper – trả về màu dựa trên % mastery.
 */
function getMasteryColor(percent) {
  if (percent >= 80) return '#10b981'; // emerald-500
  if (percent >= 50) return '#f59e0b'; // amber-500
  if (percent >= 25) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
}

function getMasteryLabel(percent) {
  if (percent >= 95) return 'Mastered';
  if (percent >= 75) return 'Good';
  if (percent >= 50) return 'Average';
  if (percent >= 25) return 'Learning';
  return 'Weak';
}

/**
 * Custom tooltip cho radar chart.
 */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-semibold text-gray-800">{data.tagName}</p>
      <div className="mt-1 space-y-0.5 text-xs">
        <p className="text-gray-600">
          Mastery:{' '}
          <span className="font-medium" style={{ color: getMasteryColor(data.masteryPercent) }}>
            {data.masteryPercent}%
          </span>
        </p>
        <p className="text-gray-500">
          Accuracy: {data.accuracy}% ({data.correctAttempts}/{data.totalAttempts} attempts)
        </p>
      </div>
    </div>
  );
};

/**
 * SkillRadarChart – Hiển thị mức thành thạo kỹ năng dạng radar.
 *
 * @param {{ userId: string }} props - userId để fetch mastery data
 */
const SkillRadarChart = ({ userId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const MAX_DISPLAY = 5;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      const token = localStorage.getItem('access_token');

      if (!token) {
        setData(null);
        return;
      }

      if (userId) {
        response = await bktService.getUserSkillMasteryById(userId);
      } else {
        response = await bktService.getUserSkillMastery('desc');
      }

      setData(response?.data || null);
    } catch (err) {
      if (err?.response?.status === 401) {
        setData(null);
      } else {
        console.error('[SkillRadar] Failed to load:', err);
        setError('Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const skills = useMemo(() => data?.skills || [], [data]);
  const stats = useMemo(() => data?.stats || {}, [data]);

  // Radar data: top skills sorted by masteryPercent (best skills first), capped
  const radarData = useMemo(() => {
    const sorted = [...skills].sort((a, b) => b.masteryPercent - a.masteryPercent);
    const display = showAll ? sorted : sorted.slice(0, MAX_DISPLAY);
    return display.map((s) => ({
      ...s,
      // Recharts radar value ∈ [0, 100]
      value: s.masteryPercent,
      // Short label for axis
      label: s.tagName.length > 10 ? s.tagName.slice(0, 9) + '…' : s.tagName,
    }));
  }, [skills, showAll]);

  // No data or not logged in
  if (!loading && (!data || skills.length === 0)) return null;

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Brain className="h-4 w-4 text-indigo-600" />
            Skills
          </CardTitle>
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-indigo-600 disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        {loading ? (
          // Loading skeleton
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="h-[180px] w-[180px] animate-pulse rounded-full bg-gray-100" />
            <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
          </div>
        ) : error ? (
          <div className="py-6 text-center text-sm text-gray-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2">
            {/* Left Column: Stats overview and Radar Chart */}
            <div className="space-y-4">
              {/* Stats summary */}
              <div className="grid grid-cols-3 gap-2 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-indigo-700">{stats.totalSkills || 0}</div>
                  <div className="text-[10px] text-gray-500 font-medium">Skills</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-600">{stats.masteredSkills || 0}</div>
                  <div className="text-[10px] text-gray-500 font-medium">Mastered</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-amber-600">{stats.averageMastery || 0}%</div>
                  <div className="text-[10px] text-gray-500 font-medium">Average</div>
                </div>
              </div>

              {/* Radar Chart */}
              {radarData.length >= 3 ? (
                <div className="mx-auto" style={{ width: '100%', height: 230 }}>
                  <ResponsiveContainer>
                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis
                        dataKey="label"
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fontSize: 9, fill: '#9ca3af' }}
                        tickCount={5}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Radar
                        name="Mastery"
                        dataKey="value"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-[230px] items-center justify-center text-sm text-gray-400">
                  At least 3 skills are required to draw the chart
                </div>
              )}
            </div>

            {/* Right Column: Skill details list */}
            <div className="space-y-4">
              <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background-color: #e0e7ff;
                  border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background-color: #c7d2fe;
                }
              `}} />

              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {showAll ? `All Skills (${skills.length})` : `Top 5 Best Skills`}
                </h4>
                
                <div className={`
                  ${showAll ? 'max-h-[300px] overflow-y-auto pr-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2 custom-scrollbar' : 'space-y-2.5'}
                `}>
                  {radarData.map((skill) => (
                    <div
                      key={skill.tagName}
                      className="flex items-center gap-2 rounded-md border border-gray-50 bg-white p-2.5 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="truncate text-xs font-semibold text-gray-700">
                            {skill.tagName}
                          </span>
                          <span
                            className="ml-2 shrink-0 text-xs font-bold"
                            style={{ color: getMasteryColor(skill.masteryPercent) }}
                          >
                            {skill.masteryPercent}%
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${skill.masteryPercent}%`,
                              backgroundColor: getMasteryColor(skill.masteryPercent),
                            }}
                          />
                        </div>
                      </div>

                      {skill.isMastered && (
                        <Award className="h-4 w-4 shrink-0 text-emerald-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Show more/less */}
              {skills.length > MAX_DISPLAY && (
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-md border border-indigo-100 py-2 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-50/50"
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" />
                      Show All ({skills.length} skills)
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillRadarChart;
