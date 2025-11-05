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
  RESET_PASSWORD: '/auth/reset',
  ONBOARDING: '/auth/onboarding'
};
export const USER_ENDPOINTS = {
  UPLOAD_AVATAR: '/users/profile/avatar/upload',    
  UPDATE_PROFILE: '/users/profile/update', 
  CHECK_USERNAME: '/users/username/check',
  GET_PROFILE: (username) => `/users/profile/${username}`
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