/**
 * Site navigation utilities
 */

// Helper to get fallback URLs based on current environment/origin
const getFallbackUrl = (key) => {
  const currentOrigin = window.location.origin;
  
  // If we are on the production domain (ball.id.vn)
  if (currentOrigin.includes('ball.id.vn')) {
    switch (key) {
      case 'teacher':
        return 'https://teacher.ball.id.vn';
      case 'user':
        return 'https://ball.id.vn';
      case 'admin':
        return 'https://admin.ball.id.vn';
      default:
        return currentOrigin;
    }
  }
  
  // Otherwise, default to local development ports
  switch (key) {
    case 'teacher':
      return 'http://localhost:5175';
    case 'user':
      return 'http://localhost:5173';
    case 'admin':
      return 'http://localhost:5174';
    default:
      return currentOrigin;
  }
};

export const SITE_URLS = {
  teacher: import.meta.env.VITE_TEACHER_SITE_URL || getFallbackUrl('teacher'),
  user: import.meta.env.VITE_USER_SITE_URL || getFallbackUrl('user'),
  admin: import.meta.env.VITE_ADMIN_SITE_URL || getFallbackUrl('admin'), 
};

// Helper to cleanly combine base URL and path to avoid double slashes or missing slashes
const combineUrl = (base, path) => {
  if (!base) return path;
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

export const goToTeacherSite = (path = '/', newTab = false) => {
  const url = combineUrl(SITE_URLS.teacher, path);
  
  if (newTab) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = url;
  }
};

export const goToUserSite = (path = '/', newTab = false) => {
  const url = combineUrl(SITE_URLS.user, path);
  
  if (newTab) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = url;
  }
};

export const goToAdminSite = (path = '/', newTab = false) => {
  const url = combineUrl(SITE_URLS.admin, path);
  
  if (newTab) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = url;
  }
};

export const getTeacherSiteUrl = (path = '/') => {
  return combineUrl(SITE_URLS.teacher, path);
};

export const getUserSiteUrl = (path = '/') => {
  return combineUrl(SITE_URLS.user, path);
};

export const getAdminSiteUrl = (path = '/') => {
  return combineUrl(SITE_URLS.admin, path);
};

export const isTeacherSite = () => {
  return window.location.origin === SITE_URLS.teacher;
};

export const isUserSite = () => {
  return window.location.origin === SITE_URLS.user;
};

export const isAdminSite = () => {
  return window.location.origin === SITE_URLS.admin;
};