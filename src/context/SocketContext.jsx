import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { toast } from 'sonner'
const SocketContext = createContext(null);

export const SocketProvider = ({ children, url }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = localStorage.getItem('access_token');
  const [latestSubmission, setLatestSubmission] = useState(null);
  const [latestNotification, setLatestNotification] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [broadcastCount, setBroadcastCount] = useState(0);
  const [latestBroadcast, setLatestBroadcast] = useState(null);
  const [latestHint, setLatestHint] = useState(null);
  const [hintHistory, setHintHistory] = useState([]);
  const [isHintDialogOpen, setHintDialogOpen] = useState(false);

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
    
    socketRef.current.on('connected', (data) => {
      console.log(' Registered with notification system:', data);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
    });

    //  Lắng nghe BROADCAST mới (thay vì new-post-published và new-contest-published)
    socketRef.current.on('new-broadcast', (data) => {
      console.log('📢 Received new broadcast:', data);
      setLatestBroadcast(data);
      setBroadcastCount(prev => prev + 1);

      // Hiển thị toast dựa trên type
      if (data.type === 'contest_announcement') {
        const startDate = data.relatedTo?.preview?.startTime 
          ? new Date(data.relatedTo.preview.startTime).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : '';

        toast.info('🏆 Kỳ thi mới', {
          description: data.message,
          duration: 8000,
          action: {
            label: 'Xem ngay',
            onClick: () => {
              window.location.href = data.actionUrl || `/contest/${data.metadata?.contestCode}`;
            }
          }
        });
      } else if (data.type === 'system_announcement') {
        // ĐỔI: Navigate đến /home thay vì /posts
        toast.info('📝 Bài viết mới', {
          description: data.message,
          duration: 6000,
          action: {
            label: 'Xem ngay',
            onClick: () => {
              // Navigate to /home with scroll state
              const postId = data.relatedTo?.id || data.metadata?.postId;
              if (postId) {
                window.location.href = `/home?scrollToPostId=${postId}`;
              } else {
                window.location.href = '/home';
              }
            }
          }
        });
      } else {
        // General announcement
        toast.info(data.title, {
          description: data.message,
          duration: 6000
        });
      }
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

    const handleHintReady = (data) => {
      const hintPayload = {
        ...data,
        hint: data?.hint || '',
        receivedAt: data?.receivedAt || new Date().toISOString()
      };

      setLatestHint(hintPayload);
      setHintHistory((prev) => {
        const hasSubmissionId = Boolean(hintPayload?.submissionId);
        const existedIndex = hasSubmissionId
          ? prev.findIndex((item) => item.submissionId === hintPayload.submissionId)
          : -1;

        if (existedIndex >= 0) {
          const cloned = [...prev];
          cloned[existedIndex] = { ...cloned[existedIndex], ...hintPayload };
          return cloned;
        }

        return [hintPayload, ...prev];
      });

      toast.info('AI Hint da san sang', {
        description: 'Nhan de xem goi y va tiep tuc tu giai bai.',
        duration: 8000,
        action: {
          label: 'Xem goi y',
          onClick: () => setHintDialogOpen(true)
        }
      });
    };

    socketRef.current.on('HINT_READY', handleHintReady);

    
    // Lắng nghe contest announcements (vẫn giữ - dành cho announcements trong contest)
    socketRef.current.on('contest-announcement', (data) => {
      console.log('📥 Received contest announcement:', data);
      
      toast.info('🏆 Thông báo cuộc thi', {
        description: data.message,
        duration: 6000
      });
    });

    //  Lắng nghe broadcast events
    socketRef.current.on('broadcast-seen-success', (data) => {
      console.log(' Broadcast marked as seen:', data.broadcastId);
      setBroadcastCount(prev => Math.max(0, prev - 1));
    });

    socketRef.current.on('broadcast-dismissed-success', (data) => {
      console.log(' Broadcast dismissed:', data.broadcastId);
      setBroadcastCount(prev => Math.max(0, prev - 1));
    });

    socketRef.current.on('broadcasts-list', (data) => {
      console.log(' Received broadcasts list:', data);
      // Handle broadcasts list if needed
    });

    // Lắng nghe khi đánh dấu đã đọc thành công (personal notifications)
    socketRef.current.on('notification-read-success', (data) => {
      console.log('Notification marked as read:', data.notificationId);
      setUnreadCount(prev => Math.max(0, prev - 1));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('HINT_READY', handleHintReady);
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

  // Join contest room
  const joinContest = (contestId) => {
    emit('join-contest', { contestId });
  };

  // Mark notification as read (personal)
  const markNotificationAsRead = (notificationId) => {
    emit('mark-notification-read', { notificationId });
  };

  //  Mark broadcast as seen
  const markBroadcastAsSeen = (broadcastId) => {
    emit('mark-broadcast-seen', { broadcastId });
  };

  //  Dismiss broadcast
  const dismissBroadcast = (broadcastId) => {
    emit('dismiss-broadcast', { broadcastId });
  };

  //  Get broadcasts
  const getBroadcasts = (options = {}) => {
    emit('get-broadcasts', options);
  };

  const openLatestHint = () => {
    if (latestHint) {
      setHintDialogOpen(true);
    }
  };

  const clearHintHistory = () => {
    setHintHistory([]);
    setLatestHint(null);
  };

  return (
    <SocketContext.Provider 
    value={{ 
      socket: socketRef.current, 
      isConnected, 
      emit, 
      on, 
      off,
      latestSubmission,
      latestNotification,
      unreadCount,
      setUnreadCount,
      broadcastCount,
      setBroadcastCount,
      latestBroadcast,
      latestHint,
      hintHistory,
      isHintDialogOpen,
      setHintDialogOpen,
      openLatestHint,
      clearHintHistory,
      joinContest,
      markNotificationAsRead,
      markBroadcastAsSeen,
      dismissBroadcast,
      getBroadcasts
    }}>
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