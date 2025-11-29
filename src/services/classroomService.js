import apiClient from '../utils/api';
import { CLASSROOM_ENDPOINTS } from '../config/endpoints';

const classroomService = {
  // CRUD Operations
  createClassroom: async (data) => {
    const response = await apiClient.post(CLASSROOM_ENDPOINTS.CREATE, data);
    return response.data;
  },

  getClassrooms: async (params = {}) => {
    const response = await apiClient.get(CLASSROOM_ENDPOINTS.GET_ALL, { params });
    return response.data;
  },

  getClassroomById: async (id) => { 
    const response = await apiClient.get(CLASSROOM_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  },

  getClassroomByClassCode: async (classCode) => {
    
    if (!classCode || classCode === 'undefined') {
      throw new Error('classCode is required');
    }

    const response = await apiClient.get(
      CLASSROOM_ENDPOINTS.GET_BY_CLASS_CODE(classCode)
    );
    return response.data;
  },

  // ===== UPDATED: Use classCode instead of id =====
  updateClassroom: async (classCode, data) => {
    const response = await apiClient.put(CLASSROOM_ENDPOINTS.UPDATE(classCode), data);
    return response.data;
  },

  deleteClassroom: async (classCode) => {
    const response = await apiClient.delete(CLASSROOM_ENDPOINTS.DELETE(classCode));
    return response.data;
  },

  // Join/Leave - ===== UPDATED =====
  joinClassroom: async (code) => {
    const response = await apiClient.post(CLASSROOM_ENDPOINTS.JOIN, code);
    return response.data;
  },

  leaveClassroom: async (classCode) => {
    const response = await apiClient.post(CLASSROOM_ENDPOINTS.LEAVE(classCode));
    return response.data;
  },

  // Invite Code - ===== UPDATED =====
  regenerateInviteCode: async (classCode) => {
    const response = await apiClient.post(CLASSROOM_ENDPOINTS.REGENERATE_INVITE(classCode));
    return response.data;
  },

  // Problems Management - ===== ALL UPDATED TO classCode =====
  getProblems: async (classCode, params = {}) => {
    const response = await apiClient.get(CLASSROOM_ENDPOINTS.GET_PROBLEMS(classCode), { params });
    return response.data;
  },

  addProblem: async (classCode, data) => {
    const response = await apiClient.post(CLASSROOM_ENDPOINTS.ADD_PROBLEM(classCode), data);
    return response.data;
  },

  removeProblem: async (classCode, problemShortId) => {
    const response = await apiClient.delete(CLASSROOM_ENDPOINTS.REMOVE_PROBLEM(classCode, problemShortId));
    return response.data;
  },

  // Students Management - ===== ALL UPDATED TO classCode =====
  getStudents: async (classCode, params = {}) => {
    const response = await apiClient.get(CLASSROOM_ENDPOINTS.GET_STUDENTS(classCode), { params });
    return response.data;
  },

  addStudent: async (classCode, data) => {
    const response = await apiClient.post(CLASSROOM_ENDPOINTS.ADD_STUDENT(classCode), data);
    return response.data;
  },

  removeStudent: async (classCode, studentId) => {
    const response = await apiClient.delete(CLASSROOM_ENDPOINTS.REMOVE_STUDENT(classCode, studentId));
    return response.data;
  },

  // Excel Upload & Email Invitations - ===== ALL UPDATED TO classCode =====
  uploadStudentsExcel: async (classCode, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(
      CLASSROOM_ENDPOINTS.UPLOAD_EXCEL(classCode),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  inviteStudentsByEmail: async (classCode, emails) => {
    const response = await apiClient.post(
      CLASSROOM_ENDPOINTS.INVITE_BY_EMAIL(classCode),
      { emails }
    );
    return response.data;
  },

  createStudentAccounts: async (classCode, emails) => {
    const response = await apiClient.post(
      CLASSROOM_ENDPOINTS.CREATE_ACCOUNTS(classCode),
      { emails }
    );
    return response.data;
  },

  // Token-based Join
  verifyInviteToken: async (classCode, token) => {    
    if (!classCode || classCode === 'undefined') {
      throw new Error('classCode is required and cannot be undefined');
    }

    if (!token || token === 'undefined') {
      throw new Error('token is required and cannot be undefined');
    }

    const url = CLASSROOM_ENDPOINTS.VERIFY_INVITE(classCode, token);
    const response = await apiClient.get(url);
    return response.data;
  },

  checkEmailRegistered: async (email) => {
    const response = await apiClient.post(
      CLASSROOM_ENDPOINTS.CHECK_EMAIL,
      { email }
    );
    return response.data;
  },

  joinClassroomByToken: async (classCode, token) => {
    if (!classCode || classCode === 'undefined') {
      throw new Error('classCode is required');
    }

    const response = await apiClient.post(
      CLASSROOM_ENDPOINTS.JOIN_BY_TOKEN(classCode),
      { token }
    );
    return response.data;
  },

  // Submissions - ===== ALL UPDATED TO classCode =====
  getSubmissions: async (classCode, params = {}) => {
    const response = await apiClient.get(CLASSROOM_ENDPOINTS.GET_SUBMISSIONS(classCode), { params });
    return response.data;
  },

  getStudentSubmissions: async (classCode, studentId, params = {}) => {
    const response = await apiClient.get(
      CLASSROOM_ENDPOINTS.GET_STUDENT_SUBMISSIONS(classCode, studentId),
      { params }
    );
    return response.data;
  },

  getProblemSubmissions: async (classCode, problemShortId, params = {}) => {
    const response = await apiClient.get(
      CLASSROOM_ENDPOINTS.GET_PROBLEM_SUBMISSIONS(classCode, problemShortId),
      { params }
    );
    return response.data;
  },
  getProblemsWithProgress: async (classCode, params = {}) => {
    const response = await apiClient.get(
      CLASSROOM_ENDPOINTS.GET_PROBLEMS_WITH_PROGRESS(classCode),
      { params }
    );
    return response.data;
  },

  // Leaderboard 
  getLeaderboard: async (classCode) => {
    const response = await apiClient.get(CLASSROOM_ENDPOINTS.GET_LEADERBOARD(classCode));
    return response.data;
  },

  // Stats
  getStats: async (classCode) => {
    const response = await apiClient.get(CLASSROOM_ENDPOINTS.GET_STATS(classCode));
    return response.data;
  },
};

export default classroomService;