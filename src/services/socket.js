import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
  if (socket && socket.connected) return socket;
  
  socket = io(process.env.VITE_API_BASE_URL || 'http://localhost:8888', {
    auth: { token },
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    socket.emit('register', )
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const onEventListeners = (event, callback) => {
  if (socket) {
    socket.on(event, callback);
  }
}

export const onPostCreated = (callback) => {
  if (socket) {
    socket.on('post:created', callback);
  }
};

export const onPostCounts = (callback) => {
  if (socket) {
    socket.on('post:counts', callback);
  }
};

export const onPostUpdated = (callback) => {
  if (socket) {
    socket.on('post:updated', callback);
  }
};

export const onPostDeleted = (callback) => {
  if (socket) {
    socket.on('post:deleted', callback);
  }
};

// Cleanup listeners
export const offPostCreated = () => {
  if (socket) {
    socket.off('post:created');
  }
};

export const offPostCounts = () => {
  if (socket) {
    socket.off('post:counts');
  }
};

export const offPostUpdated = () => {
  if (socket) {
    socket.off('post:updated');
  }
};

export const offPostDeleted = () => {
  if (socket) {
    socket.off('post:deleted');
  }
};