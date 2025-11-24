import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { toast } from 'sonner'
const SocketContext = createContext(null);

export const SocketProvider = ({ children, url }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = localStorage.getItem('access_token');
  const [latestSubmission, setLatestSubmission] = useState(null);
  useEffect(() => {
    socketRef.current = io(url, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      auth: {
        token: token,
      }
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Token: ', token);
      socketRef.current.emit('register');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
    });
    socketRef.current.on('submission-update', (data) => {
      console.log('📥 Received submission update:', data);
      setLatestSubmission(data);

      // Show toast based on status
      if (data.status === 'Accepted') {
        toast.success(`'Nộp bài thành công`, {
          description: `Runtime: ${data.time}ms | Memory: ${data.memory}KB`,
          duration: 5000
        });
      } else if (data.status === 'Wrong Answer') {
        toast.error(`Wrong Answer`, {
          description: `Passed: ${data.passed || 0}/${data.total || 10} test cases`,
          duration: 5000
        });
      } else if (data.status === 'Time Limit Exceeded') {
        toast.warning(`⏱️ ${data.problem?.name || 'Bài tập'} - Time Limit Exceeded`, {
          duration: 5000
        });
      } else if (data.status === 'Memory Limit Exceeded') {
        toast.warning(`💾 ${data.problem?.name || 'Bài tập'} - Memory Limit Exceeded`, {
          duration: 5000
        });
      } else if (data.status === 'Compilation Error') {
        toast.error(`🔧 ${data.problem?.name || 'Bài tập'} - Compilation Error`, {
          duration: 5000
        });
      } else if (data.status === 'Runtime Error') {
        toast.error(`⚠️ ${data.problem?.name || 'Bài tập'} - Runtime Error`, {
          duration: 5000
        });
      } else if (data.status !== 'Pending') {
        toast.error(`❌ ${data.problem?.name || 'Bài tập'} - ${data.status}`, {
          duration: 5000
        });
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url, token]);

  const emit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };
  

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected, emit, on, off }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};