export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getFileIcon = (fileType) => {
  if (!fileType) return '📎';
  
  if (fileType.startsWith('image/')) return '🖼️';
  if (fileType.startsWith('video/')) return '🎥';
  if (fileType.startsWith('audio/')) return '🎵';
  if (fileType === 'application/pdf') return '📄';
  if (fileType.includes('word')) return '📝';
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📊';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📈';
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return '📦';
  if (fileType === 'text/plain') return '📃';
  return '📎';
};

export const getFileTypeLabel = (fileType) => {
  if (!fileType) return 'File';
  
  if (fileType.startsWith('image/')) return 'Hình ảnh';
  if (fileType.startsWith('video/')) return 'Video';
  if (fileType.startsWith('audio/')) return 'Audio';
  if (fileType === 'application/pdf') return 'PDF';
  if (fileType.includes('word')) return 'Word';
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'PowerPoint';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'Excel';
  if (fileType.includes('zip') || fileType.includes('rar')) return 'Archive';
  if (fileType === 'text/plain') return 'Text';
  return 'File';
};

export const getCategoryColor = (category) => {
  const colors = {
    lecture: 'primary',
    assignment: 'success',
    reference: 'info',
    exam: 'error',
    other: 'default'
  };
  return colors[category] || 'default';
};

export const getCategoryLabel = (category) => {
  const labels = {
    lecture: 'Bài giảng',
    assignment: 'Bài tập',
    reference: 'Tài liệu tham khảo',
    exam: 'Đề thi',
    other: 'Khác'
  };
  return labels[category] || category;
};

export const validateFile = (file, maxSize = 50 * 1024 * 1024) => {
  if (!file) {
    return { valid: false, error: 'Vui lòng chọn file' };
  }

  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File quá lớn! Kích thước tối đa là ${formatFileSize(maxSize)}` 
    };
  }

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/x-msvideo',
    'video/quicktime',
    'audio/mpeg',
    'audio/wav'
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Loại file không được hỗ trợ!'
    };
  }

  return { valid: true };
};