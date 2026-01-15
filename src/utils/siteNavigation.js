/**
 * Site navigation utilities
 */

export const SITE_URLS = {
  teacher: import.meta.env.VITE_TEACHER_SITE_URL,
  user: import.meta.env.VITE_USER_SITE_URL,
  admin: import.meta.env.VITE_ADMIN_SITE_URL, 
};


export const goToTeacherSite = (path = '/', newTab = false) => {
  const url = `${SITE_URLS.teacher}${path}`;
  
  if (newTab) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = url;
  }
};


export const goToUserSite = (path = '/', newTab = false) => {
  const url = `${SITE_URLS.user}${path}`;
  
  if (newTab) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = url;
  }
};


export const goToAdminSite = (path = '/', newTab = false) => {
  const url = `${SITE_URLS.admin}${path}`;
  
  if (newTab) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = url;
  }
};


export const getTeacherSiteUrl = (path = '/') => {
  return `${SITE_URLS.teacher}${path}`;
};


export const getUserSiteUrl = (path = '/') => {
  return `${SITE_URLS.user}${path}`;
};


export const getAdminSiteUrl = (path = '/') => {
  return `${SITE_URLS.admin}${path}`;
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