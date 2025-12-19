export const AUTH_ENDPOINTS = {
  LOGIN: '/auth',
  REGISTER: '/auth/register',
  REGISTER_RESEND_OTP: '/auth/register/resend-otp',
  REGISTER_VERIFY_OTP: '/auth/register/verify-otp',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',          
  FORGOT_PASSWORD_SEND_OTP: '/auth/forgot-password/send-otp',
  FORGOT_PASSWORD_VERIFY_OTP: '/auth/forgot-password/verify-otp',
  FORGOT_PASSWORD_RESET: '/auth/forgot-password/reset',
  FORGOT_PASSWORD_RESEND_OTP: '/auth/forgot-password/resend-otp',
  ONBOARDING: '/auth/onboarding'
};
export const USER_ENDPOINTS = {
  UPLOAD_AVATAR: '/users/profile/avatar/upload',    
  UPDATE_PROFILE: '/users/profile/update', 
  CHECK_USERNAME: '/users/username/check',
  GET_PROFILE: (userName) => `/users/profile/${userName}`,
  GET_RATING: '/users/rating',
}
export const PROBLEM_ENDPOINTS = {
  GET_PROLBEM_ID: (id) => `/problems/${id}`,
  GET_PROBLEM_SHORT_ID: (shortId) => `/problems/short/${shortId}`,
  GET_PROBLEMS: '/problems',
}
export const POST_ENDPOINTS = {
  GET_ALL: '/posts/all',
  GET_POPULAR: '/posts/popular',
  GET_RECENT: '/posts/recent',
  GET_DETAILS: (id) => `/posts/${id}/details`,
  CREATE: '/posts/create',
  UPDATE: (id) => `/posts/${id}/update`,
  DELETE: (id) => `/posts/${id}/delete`,
  LIKE: (id) => `/posts/${id}/actions/like`,
  UNLIKE: (id) => `/posts/${id}/actions/unlike`,
  TOGGLE_LIKE: (id) => `/posts/${id}/actions/toggle-like`,
  SHARE: (id) => `/posts/${id}/actions/share`,
  VIEW: (id) => `/posts/${id}/actions/view`,
  BOOKMARK: (id) => `/posts/${id}/bookmark`,
  UNBOOKMARK: (id) => `/posts/${id}/unbookmark`
};

export const COMMENT_ENDPOINTS = {
  CREATE: '/comments',
  GET_POST_COMMENTS: (postId) => `/comments/post/${postId}`,
  GET_COMMENT_REPLIES: (commentId) => `/comments/${commentId}/replies`,
  LOAD_MORE_REPLIES: (commentId) => `/comments/${commentId}/load-more-replies`,
  UPDATE: (commentId) => `/comments/${commentId}`,
  DELETE: (commentId) => `/comments/${commentId}`,
  TOGGLE_LIKE: (commentId) => `/comments/${commentId}/like`,
  GET_BY_ID: (commentId) => `/comments/${commentId}`
};

export const UPLOAD_ENDPOINTS = {
  POST_IMAGES_MULTIPLE: '/upload/posts/multiple',
  POST_IMAGE_SINGLE: '/upload/posts/single',
  POST_IMAGES_GET: (postId) => `/upload/posts/${postId}/images`,
  AVATAR: '/upload/avatar'
};

export const SUBMISSION_ENDPOINTS = {
  GET_SUBMISSION_BY_USER_ID: (userId) => `/submissions/user/${userId}`,
  GET_SUBMISSION_BY_ID: (submissionId) => `/submissions/${submissionId}`,
  GET_SUBMISSION_CALENDAR: (userId) => `/submissions/user/${userId}/calendar`,
  GET_SUBMISSION_STATUS_CHART: (userId) => `/submissions/user/${userId}/status-chart`,
  GET_SUBMISSION_DIFFICULTY_CHART: (userId) => `/submissions/user/${userId}/difficulty-chart`
}
export const CLASSROOM_ENDPOINTS = {
  // CRUD Classroom
  CREATE: '/classroom',
  GET_ALL: '/classroom',
  GET_BY_ID: (id) => `/classroom/${id}`, // Keep for backward compatibility
  GET_BY_CLASS_CODE: (classCode) => `/classroom/class/${classCode}`,
  UPDATE: (classCode) => `/classroom/class/${classCode}`, // ← CHANGED
  DELETE: (classCode) => `/classroom/class/${classCode}`, // ← CHANGED
  
  // Join/Leave
  JOIN: '/classroom/join',
  LEAVE: (classCode) => `/classroom/class/${classCode}/leave`, // ← CHANGED
  
  // Invite Code
  REGENERATE_INVITE: (classCode) => `/classroom/class/${classCode}/regenerate-invite`, // ← CHANGED
  
  // Problems Management - ← ALL CHANGED TO classCode
  GET_PROBLEMS: (classCode) => `/classroom/class/${classCode}/problems`,
  ADD_PROBLEM: (classCode) => `/classroom/class/${classCode}/problems`,
  REMOVE_PROBLEM: (classCode, problemShortId) => `/classroom/class/${classCode}/problems/${problemShortId}`,
  GET_PROBLEMS_WITH_PROGRESS: (classCode) => `/classroom/class/${classCode}/problems/with-progress`,
  // Students Management - ← ALL CHANGED TO classCode
  GET_STUDENTS: (classCode) => `/classroom/class/${classCode}/students`,
  ADD_STUDENT: (classCode) => `/classroom/class/${classCode}/students`,
  REMOVE_STUDENT: (classCode, studentId) => `/classroom/class/${classCode}/students/${studentId}`,
  
  // Excel Upload & Email Invitations - ← ALL CHANGED TO classCode
  UPLOAD_EXCEL: (classCode) => `/classroom/class/${classCode}/upload-students-excel`,
  INVITE_BY_EMAIL: (classCode) => `/classroom/class/${classCode}/invite-by-email`,
  CREATE_ACCOUNTS: (classCode) => `/classroom/class/${classCode}/create-accounts`,
  
  // Token-based Join
  VERIFY_INVITE: (classCode, token) => `/classroom/${classCode}/verify-invite/${token}`,
  CHECK_EMAIL: '/classroom/check-email',
  JOIN_BY_TOKEN: (classCode) => `/classroom/${classCode}/join-by-token`, 
  
  // Submissions & Grading - ← ALL CHANGED TO classCode
  GET_SUBMISSIONS: (classCode) => `/classroom/class/${classCode}/submissions`,
  GET_STUDENT_SUBMISSIONS: (classCode, studentId) => `/classroom/class/${classCode}/students/${studentId}/submissions`,
  GET_PROBLEM_SUBMISSIONS: (classCode, problemShortId) => `/classroom/class/${classCode}/problems/${problemShortId}/submissions`,
  
  // Leaderboard - ← CHANGED TO classCode
  GET_LEADERBOARD: (classCode) => `/classroom/class/${classCode}/leaderboard`,
  
  // Stats - ← CHANGED TO classCode
  GET_STATS: (classCode) => `/classroom/class/${classCode}/stats`,
};
export const MATERIAL_ENDPOINTS = {
  // Get materials
  GET_MATERIALS: (classCode) => `/classroom/class/${classCode}/materials`,
  GET_MATERIAL: (classCode, materialId) => `/classroom/class/${classCode}/materials/${materialId}`,
  
  // Upload material
  UPLOAD_MATERIAL: (classCode) => `/classroom/class/${classCode}/materials`,
  
  // Update material
  UPDATE_MATERIAL: (classCode, materialId) => `/classroom/class/${classCode}/materials/${materialId}`,
  
  // Delete material
  DELETE_MATERIAL: (classCode, materialId) => `/classroom/class/${classCode}/materials/${materialId}`,
  
  // Download material
  DOWNLOAD_MATERIAL: (classCode, materialId) => `/classroom/class/${classCode}/materials/${materialId}/download`,
  
  // Stats & Special endpoints
  GET_STATS: (classCode) => `/classroom/class/${classCode}/materials/stats`,
  GET_RECENT: (classCode) => `/classroom/class/${classCode}/materials/recent`,
  GET_POPULAR: (classCode) => `/classroom/class/${classCode}/materials/popular`,
};

export const CONTEST_ENDPOINTS = {
  GET_ALL: '/contests',
  GET_BY_CODE: (code) => `/contests/code/${code}`,  // Append contest code when using
  REGISTER_CONTEST: (id) => `/contests/${id}/register`,
  REGISTER_CLASSROOM_CONTEST: (id) => `/contests/classroom/${id}/register`,
  GET_CONTETS_RANKING: (contestId) => `/contests/${contestId}/ranking`
}
export const DISCUSSION_ENDPOINTS = {
  // Discussion CRUD
  GET_DISCUSSIONS: (classCode) => `/classroom/class/${classCode}/discussions`,
  GET_DISCUSSION_BY_ID: (classCode, discussionId) => `/classroom/class/${classCode}/discussions/${discussionId}`,
  UPDATE_DISCUSSION: (classCode, discussionId) => `/classroom/class/${classCode}/discussions/${discussionId}`,
  DELETE_DISCUSSION: (classCode, discussionId) => `/classroom/class/${classCode}/discussions/${discussionId}`,
  
  // Comments
  ADD_COMMENT: (classCode, discussionId) => `/classroom/class/${classCode}/discussions/${discussionId}/comments`,
  EDIT_COMMENT: (classCode, discussionId, commentId) => `/classroom/class/${classCode}/discussions/${discussionId}/comments/${commentId}`,
  DELETE_COMMENT: (classCode, discussionId, commentId) => `/classroom/class/${classCode}/discussions/${discussionId}/comments/${commentId}`,
  TOGGLE_COMMENT_LIKE: (classCode, discussionId, commentId) => `/classroom/class/${classCode}/discussions/${discussionId}/comments/${commentId}/like`,
  
  // Replies
  ADD_REPLY: (classCode, discussionId, commentId) => `/classroom/class/${classCode}/discussions/${discussionId}/comments/${commentId}/replies`,
  EDIT_REPLY: (classCode, discussionId, commentId, replyId) => `/classroom/class/${classCode}/discussions/${discussionId}/comments/${commentId}/replies/${replyId}`,
  DELETE_REPLY: (classCode, discussionId, commentId, replyId) => `/classroom/class/${classCode}/discussions/${discussionId}/comments/${commentId}/replies/${replyId}`,
  TOGGLE_REPLY_LIKE: (classCode, discussionId, commentId, replyId) => `/classroom/class/${classCode}/discussions/${discussionId}/comments/${commentId}/replies/${replyId}/like`,
  
  // Reactions
  ADD_REACTION: (classCode, discussionId) => `/classroom/class/${classCode}/discussions/${discussionId}/react`,
  REMOVE_REACTION: (classCode, discussionId) => `/classroom/class/${classCode}/discussions/${discussionId}/react`,
  
  
};
export const STATISTICS_ENDPOINTS = {
  PUBLIC: '/statistics/public',

};