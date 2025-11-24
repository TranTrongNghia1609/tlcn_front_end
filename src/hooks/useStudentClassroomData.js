import { useState, useEffect, useCallback } from 'react';
import classroomService from '@/services/classroomService';
import materialService from '@/services/materialService';
import { toast } from 'sonner';

export const useStudentClassroomData = (classCode) => {
  const [state, setState] = useState({
    classroom: null,
    problems: [],
    materials: [],
    submissions: [],
    leaderboard: [],
    stats: null,
    loading: true,
    error: null,
  });

  const fetchAllData = useCallback(async () => {
    if (!classCode) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch classroom data first
      const classroomResponse = await classroomService.getClassroomByClassCode(classCode);

      //  Extract classroom - API returns { data: { classroom: {...}, role: "student" } }
      const classroomData = classroomResponse?.data?.classroom;

      if (!classroomData) {
        throw new Error('Không tìm thấy thông tin lớp học');
      }

      // Extract problems from classroom data
      const problemsData = classroomData.problems || [];

      // Extract student progress from classroom data
      const studentProgress = classroomData.studentProgress || [];

      // Map progress to problems
      const problemsWithProgress = problemsData.map(problemItem => {
        const problem = problemItem.problem || problemItem;
        const progress = studentProgress.find(
          p => p.problemShortId === problem.shortId
        );

        return {
          ...problem,
          _id: problem._id,
          shortId: problem.shortId,
          name: problem.name,
          difficulty: problem.difficulty,
          tags: problem.tags || [],
          progress: progress ? {
            status: progress.status, // 'completed', 'attempted', 'not_attempted'
            bestScore: progress.bestScore || 0,
            lastSubmissionAt: progress.lastSubmissionAt,
            completedAt: progress.completedAt,
          } : {
            status: 'not_attempted',
            bestScore: 0,
          }
        };
      });


      //  Fetch materials and stats in parallel
      const [materialsRes, statsRes] = await Promise.allSettled([
        materialService.getMaterials(classCode, { limit: 100 }),
        classroomService.getStats(classCode),
      ]);



      // Process materials
      let materialsData = [];
      if (materialsRes.status === 'fulfilled') {
        const materialsValue = materialsRes.value;
        materialsData = materialsValue?.materials || 
                       materialsValue?.data?.materials ||
                       materialsValue?.data?.items ||
                       materialsValue?.items ||
                       [];
      } else {
      }

      let statsData = null;
      if (statsRes.status === 'fulfilled') {
        const statsValue = statsRes.value;
        statsData = statsValue?.data?.stats || 
                   statsValue?.data || 
                   null;
      } else {
      }

      // Calculate additional stats from classroom data
      const completedProblems = studentProgress.filter(p => p.status === 'completed').length;
      const attemptedProblems = studentProgress.filter(p => p.status === 'attempted').length;
      const totalScore = studentProgress
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.bestScore || 0), 0);
      const averageScore = completedProblems > 0 
        ? Math.round(totalScore / completedProblems) 
        : 0;

      const calculatedStats = {
        totalProblems: problemsData.length,
        completedProblems,
        attemptedProblems,
        notAttemptedProblems: problemsData.length - completedProblems - attemptedProblems,
        completionRate: problemsData.length > 0 
          ? Math.round((completedProblems / problemsData.length) * 100)
          : 0,
        totalScore,
        averageScore,
        lastSubmission: studentProgress.length > 0
          ? studentProgress.reduce((latest, p) => 
              !latest || new Date(p.lastSubmissionAt) > new Date(latest) 
                ? p.lastSubmissionAt 
                : latest
            , null)
          : null,
        recentCompletions: studentProgress
          .filter(p => p.status === 'completed')
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
          .slice(0, 5)
          .map(p => ({
            problemShortId: p.problemShortId,
            score: p.bestScore,
            completedAt: p.completedAt,
          })),
        ...statsData, // Merge with API stats if available
      };

      const newState = {
        classroom: classroomData,
        problems: problemsWithProgress,
        materials: Array.isArray(materialsData) ? materialsData : [],
        stats: calculatedStats,
        loading: false,
        error: null,
      };



      setState(prev => ({ ...prev, ...newState }));

    } catch (error) {


      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Không thể tải dữ liệu lớp học';

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      
      toast.error(errorMessage);
    }
  }, [classCode]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);
 
  const refresh = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    ...state,
    refresh,
  };
};