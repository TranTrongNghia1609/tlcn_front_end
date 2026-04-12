import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';
import classroomService from '@/services/classroomService';
import materialService from '@/services/materialService'; 

const StudentClassroomContext = createContext(undefined);

export const useStudentClassroom = () => {
  const context = useContext(StudentClassroomContext);
  if (!context) {
    throw new Error('useStudentClassroom must be used within StudentClassroomProvider');
  }
  return context;
};

export const StudentClassroomProvider = ({ children }) => {
  const [classroom, setClassroom] = useState(null);
  const [problems, setProblems] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch classroom details - FIXED
  const fetchClassroom = useCallback(async (classCode) => {
    setLoading(true);
    try {
      console.log('🔄 Fetching classroom:', classCode);
      const response = await classroomService.getClassroomByClassCode(classCode);
      console.log('✅ Classroom API raw response:', response);
      
      // ✅ FIX: Extract classroom from response.data.classroom
      const classroomData = 
        response?.data?.classroom ||  // ✅ Your API structure
        response?.classroom ||        
        response?.data ||             
        response ||                   
        null;
      
      console.log('✅ Classroom extracted:', classroomData);
      
      if (!classroomData) {
        throw new Error('No classroom data found');
      }
      
      setClassroom(classroomData);
      return classroomData;
    } catch (error) {
      console.error('❌ Error fetching classroom:', error);
      toast.error('Không thể tải thông tin lớp học');
      setClassroom(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch problems
  const fetchProblems = useCallback(async (classCode) => {
    setLoading(true);
    try {
      console.log('🔄 Fetching problems for:', classCode);
      const response = await classroomService.getProblems(classCode);
      console.log('✅ Problems response:', response);
      
      const problemsData = 
        response?.data?.items || 
        response?.items || 
        response?.data || 
        [];
      console.log('✅ Problems extracted:', problemsData);
      
      setProblems(Array.isArray(problemsData) ? problemsData : []);
      return problemsData;
    } catch (error) {
      console.error('❌ Error fetching problems:', error);
      toast.error('Không thể tải danh sách bài tập');
      setProblems([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch materials
  const fetchMaterials = useCallback(async (classCode) => {
    setLoading(true);
    try {
      console.log('🔄 Fetching materials for:', classCode);
      const response = await materialService.getMaterials(classCode);
      console.log('✅ Materials response:', response);
      
      const materialsData = 
        response?.data?.materials ||
        response?.materials ||
        response?.data?.items ||
        response?.items ||
        response?.data ||
        [];
      
      console.log('✅ Materials extracted:', materialsData);
      
      setMaterials(Array.isArray(materialsData) ? materialsData : []);
      return materialsData;
    } catch (error) {
      console.error('❌ Error fetching materials:', error);
      toast.error('Không thể tải tài liệu');
      setMaterials([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch submissions
  const fetchSubmissions = useCallback(async (classCode) => {
    setLoading(true);
    try {
      console.log('🔄 Fetching submissions for:', classCode);
      const response = await classroomService.getSubmissions(classCode);
      console.log('✅ Submissions response:', response);
      
      const submissionsData = 
        response?.data?.items || 
        response?.items || 
        response?.data || 
        [];
      console.log('✅ Submissions extracted:', submissionsData);
      
      setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
      return submissionsData;
    } catch (error) {
      console.error('❌ Error fetching submissions:', error);
      toast.error('Không thể tải lịch sử nộp bài');
      setSubmissions([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch leaderboard
  const fetchLeaderboard = useCallback(async (classCode) => {
    setLoading(true);
    try {
      console.log('🔄 Fetching leaderboard for:', classCode);
      const response = await classroomService.getLeaderboard(classCode);
      console.log('✅ Leaderboard response:', response);
      
      const leaderboardData = 
        response?.data?.items || 
        response?.items || 
        response?.data || 
        [];
      console.log('✅ Leaderboard extracted:', leaderboardData);
      
      setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
      return leaderboardData;
    } catch (error) {
      console.error('❌ Error fetching leaderboard:', error);
      toast.error('Không thể tải bảng xếp hạng');
      setLeaderboard([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch stats
  const fetchStats = useCallback(async (classCode) => {
    setLoading(true);
    try {
      console.log('🔄 Fetching stats for:', classCode);
      const response = await classroomService.getStats(classCode);
      console.log('✅ Stats response:', response);
      
      const statsData = response?.data || response || null;
      setStats(statsData);
      return statsData;
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      toast.error('Không thể tải thống kê');
      setStats(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Leave classroom
  const leaveClassroom = useCallback(async (classCode) => {
    try {
      console.log('🔄 Leaving classroom:', classCode);
      await classroomService.leaveClassroom(classCode);
      toast.success('Đã rời khỏi lớp học');
      
      setClassroom(null);
      setProblems([]);
      setMaterials([]);
      setSubmissions([]);
      setLeaderboard([]);
      setStats(null);
    } catch (error) {
      console.error('❌ Error leaving classroom:', error);
      toast.error('Không thể rời lớp học');
      throw error;
    }
  }, []);

  const value = {
    classroom,
    problems,
    materials,
    submissions,
    leaderboard,
    stats,
    loading,
    fetchClassroom,
    fetchProblems,
    fetchMaterials,
    fetchSubmissions,
    fetchLeaderboard,
    fetchStats,
    leaveClassroom,
  };

  return (
    <StudentClassroomContext.Provider value={value}>
      {children}
    </StudentClassroomContext.Provider>
  );
};

export default StudentClassroomContext;