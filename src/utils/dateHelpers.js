import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi });
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