import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi });
};
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};
export const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateShort = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'dd/MM/yyyy', { locale: vi });
};

export const formatTimeAgo = (date) => {
  if (!date) return 'N/A';
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

export const getDaysUntil = (date) => {
  if (!date) return null;
  const diff = new Date(date) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
};
export const getExamStatus = (startTime, endTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) {
    return 'upcoming';
  } else if (now >= start && now <= end) {
    return 'ongoing';
  } else {
    return 'ended';
  }
};

export const formatDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} ngày ${hours % 24} giờ`;
  } else if (hours > 0) {
    return `${hours} giờ ${minutes % 60} phút`;
  } else if (minutes > 0) {
    return `${minutes} phút`;
  } else {
    return `${seconds} giây`;
  }
};

export const getTimeUntilExam = (startTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const diff = start - now;

  if (diff <= 0) return 'Đã bắt đầu';

  return `Còn ${formatDuration(diff)}`;
};

export const getTimeRemaining = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now;

  if (diff <= 0) return 'Đã kết thúc';

  return formatDuration(diff);
};