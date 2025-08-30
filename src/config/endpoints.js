export const AUTH_ENDPOINTS = {
  LOGIN: '/auth',
  REGISTER: '/auth/register',
  REGISTER_RESEND_OTP: '/auth/register/resend-otp',
  REGISTER_VERIFY_OTP: '/auth/register/verify-otp',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',          
  FORGOT_PASSWORD_SEND_OTP: '/auth/forgot-password/send-otp',
  FORGOT_PASSWORD_VERIFY_OTP: '/auth/forgot-password/verify-otp',
  RESET_PASSWORD: '/auth/reset',
};
export const USER_ENDPOINTS = {
  UPLOAD_AVATAR: '/users/profile/upload/avatar',    
  UPDATE_PROFILE: '/users/profile/update', 
}