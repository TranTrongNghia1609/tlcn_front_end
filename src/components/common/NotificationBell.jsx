import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2, Loader2, User, Megaphone, EyeOff } from 'lucide-react';
import { useSocket } from '@/context/SocketContext';
import notificationService from '@/services/notificationService';
import broadcastService from '@/services/broadcastService';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const { unreadCount, setUnreadCount, broadcastCount, setBroadcastCount, markNotificationAsRead, markBroadcastAsSeen, dismissBroadcast: socketDismissBroadcast } = useSocket();
  const [activeTab, setActiveTab] = useState('personal');
  const [personalNotifications, setPersonalNotifications] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const LIMIT_PER_PAGE = 10;
  const totalCount = unreadCount + broadcastCount;

  useEffect(() => {
    fetchUnreadCount();
    fetchBroadcastCount();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchBroadcastCount = async () => {
    try {
      const response = await broadcastService.getUnseenCount();
      setBroadcastCount(response.data.count);
    } catch (error) {
      console.error('Error fetching broadcast count:', error);
    }
  };

  const fetchPersonalNotifications = async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await notificationService.getNotifications({
        page,
        limit: LIMIT_PER_PAGE
      });

      const newNotifications = response.data.notifications || [];
      const total = response.data.pagination?.total || 0;

      if (append) {
        setPersonalNotifications(prev => [...prev, ...newNotifications]);
      } else {
        setPersonalNotifications(newNotifications);
      }

      const totalFetched = append 
        ? personalNotifications.length + newNotifications.length 
        : newNotifications.length;
      
      setHasMore(totalFetched < total);
      setCurrentPage(page);

    } catch (error) {
      console.error('Error fetching personal notifications:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchBroadcasts = async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await broadcastService.getBroadcasts({
        page,
        limit: LIMIT_PER_PAGE
      });

      const newBroadcasts = response.data.broadcasts || [];

      if (append) {
        setBroadcasts(prev => [...prev, ...newBroadcasts]);
      } else {
        setBroadcasts(newBroadcasts);
      }

      setHasMore(newBroadcasts.length === LIMIT_PER_PAGE);
      setCurrentPage(page);

    } catch (error) {
      console.error('Error fetching broadcasts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setCurrentPage(1);
      setHasMore(true);
      if (activeTab === 'personal') {
        fetchPersonalNotifications(1, false);
      } else {
        fetchBroadcasts(1, false);
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setHasMore(true);
    if (tab === 'personal') {
      fetchPersonalNotifications(1, false);
    } else {
      fetchBroadcasts(1, false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      if (activeTab === 'personal') {
        fetchPersonalNotifications(currentPage + 1, true);
      } else {
        fetchBroadcasts(currentPage + 1, true);
      }
    }
  };

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(notificationId);
      markNotificationAsRead(notificationId);
      
      setPersonalNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      
      setPersonalNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(notificationId);
      setPersonalNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      fetchUnreadCount();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handlePersonalNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification._id);
        markNotificationAsRead(notification._id);
        
        setPersonalNotifications(prev =>
          prev.map(notif =>
            notif._id === notification._id ? { ...notif, isRead: true } : notif
          )
        );
        
        fetchUnreadCount();
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    setIsOpen(false);

    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    } else if (notification.type === 'submission_result' && notification.relatedTo?.id) {
      navigate(`/submission/${notification.relatedTo.id}`);
    }
  };

  const handleMarkBroadcastAsSeen = async (broadcastId, e) => {
    e.stopPropagation();
    try {
      await broadcastService.markAsSeen(broadcastId);
      markBroadcastAsSeen(broadcastId);
      
      setBroadcasts(prev => prev.filter(b => b._id !== broadcastId));
      fetchBroadcastCount();
    } catch (error) {
      console.error('Error marking broadcast as seen:', error);
    }
  };

  const handleDismissBroadcast = async (broadcastId, e) => {
    e.stopPropagation();
    try {
      await broadcastService.dismissBroadcast(broadcastId);
      socketDismissBroadcast(broadcastId);
      
      setBroadcasts(prev => prev.filter(b => b._id !== broadcastId));
      fetchBroadcastCount();
    } catch (error) {
      console.error('Error dismissing broadcast:', error);
    }
  };

  const handleBroadcastClick = async (broadcast) => {
    // Mark as seen first
    try {
      await broadcastService.markAsSeen(broadcast._id);
      markBroadcastAsSeen(broadcast._id);
      setBroadcasts(prev => prev.filter(b => b._id !== broadcast._id));
      fetchBroadcastCount();
    } catch (error) {
      console.error('Error marking broadcast as seen:', error);
    }

    setIsOpen(false);

    // Handle navigation based on broadcast type
    if (broadcast.type === 'system_announcement' && broadcast.relatedTo?.type === 'Post') {
      // Get post ID from relatedTo or metadata
      const postId = broadcast.relatedTo?.id || broadcast.metadata?.postId;
      
      if (postId) {
        // Navigate to home page with scroll state
        navigate('/home', {
          state: {
            scrollToPostId: postId,
            highlightPost: true
          }
        });
      } else {
        // Fallback to home if no postId
        navigate('/home');
      }
    } else if (broadcast.type === 'contest_announcement') {
      // Navigate to contest detail
      const contestCode = broadcast.metadata?.contestCode;
      if (contestCode) {
        navigate(`/contest/${contestCode}`);
      } else if (broadcast.actionUrl) {
        navigate(broadcast.actionUrl);
      } else {
        navigate('/contests');
      }
    } else if (broadcast.actionUrl) {
      // Default: use actionUrl
      navigate(broadcast.actionUrl);
    } else {
      // Fallback to home
      navigate('/home');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'submission_result':
        return '✅';
      case 'contest_start':
        return '🏁';
      case 'contest_end':
        return '🏆';
      case 'comment_reply':
        return '💬';
      case 'rank_achievement':
        return '🎖️';
      default:
        return '🔔';
    }
  };

  const getBroadcastIcon = (type) => {
    switch (type) {
      case 'contest_announcement':
        return '🏆';
      case 'system_announcement':
        return '📝';
      case 'maintenance_alert':
        return '⚠️';
      default:
        return '📢';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-4 border-red-500';
      case 'high':
        return 'border-l-4 border-orange-500';
      case 'normal':
        return 'border-l-4 border-blue-500';
      default:
        return 'border-l-4 border-gray-300';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
      >
        <Bell size={20} />
        {totalCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full min-w-[20px]">
            {totalCount > 99 ? '99+' : totalCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
          {/* Header with Tabs */}
          <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">Thông báo</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => handleTabChange('personal')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-sm transition-all cursor-pointer ${
                  activeTab === 'personal'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User size={16} />
                <span>Tới tôi</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabChange('broadcast')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-sm transition-all cursor-pointer ${
                  activeTab === 'broadcast'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Megaphone size={16} />
                <span>Thông báo chung</span>
                {broadcastCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {broadcastCount > 99 ? '99+' : broadcastCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mark all as read for personal tab */}
            {activeTab === 'personal' && unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="mt-2 w-full text-xs text-blue-600 hover:text-blue-700 font-medium py-1 hover:bg-blue-50 rounded transition-colors cursor-pointer"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 size={32} className="animate-spin mx-auto text-blue-600" />
              </div>
            ) : activeTab === 'personal' ? (
              // Personal Notifications
              personalNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <User size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>Không có thông báo cá nhân</p>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-gray-100">
                    {personalNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handlePersonalNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 text-2xl">
                            {getNotificationIcon(notification.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-sm text-gray-900">
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(notification.createdAt), {
                                  addSuffix: true,
                                  locale: vi
                                })}
                              </p>
                              <div className="flex items-center gap-1">
                                {!notification.isRead && (
                                  <button
                                    onClick={(e) => handleMarkAsRead(notification._id, e)}
                                    className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded cursor-pointer"
                                    title="Đánh dấu đã đọc"
                                  >
                                    <Check size={14} />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => handleDeleteNotification(notification._id, e)}
                                  className="p-1 text-red-600 hover:text-red-700 hover:bg-red-100 rounded cursor-pointer"
                                  title="Xóa"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
            ) : (
              // Broadcasts
              broadcasts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Megaphone size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>Không có thông báo chung mới</p>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-gray-100">
                    {broadcasts.map((broadcast) => (
                      <div
                        key={broadcast._id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${getPriorityColor(broadcast.priority)}`}
                        onClick={() => handleBroadcastClick(broadcast)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 text-2xl">
                            {getBroadcastIcon(broadcast.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900">
                              {broadcast.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {broadcast.message}
                            </p>

                            {/* Preview */}
                            {broadcast.type === 'contest_announcement' && broadcast.relatedTo?.preview && (
                              <div className="mt-2 space-y-1 text-xs">
                                {broadcast.relatedTo.preview.startTime && (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <span>Bắt đầu:</span>
                                    <span className="font-medium">
                                      {new Date(broadcast.relatedTo.preview.startTime).toLocaleString('vi-VN')}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {broadcast.type === 'system_announcement' && broadcast.relatedTo?.preview && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                <p className="text-gray-700 line-clamp-2">
                                  {broadcast.relatedTo.preview.content}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(broadcast.createdAt), {
                                  addSuffix: true,
                                  locale: vi
                                })}
                              </p>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => handleMarkBroadcastAsSeen(broadcast._id, e)}
                                  className="p-1 text-green-600 hover:text-green-700 hover:bg-green-100 rounded cursor-pointer"
                                  title="Đã hiểu"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={(e) => handleDismissBroadcast(broadcast._id, e)}
                                  className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
                                  title="Ẩn"
                                >
                                  <EyeOff size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
            )}

            {/* Load More */}
            {hasMore && (activeTab === 'personal' ? personalNotifications : broadcasts).length > 0 && (
              <div className="p-3 border-t border-gray-100">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loadingMore ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Đang tải...
                    </span>
                  ) : (
                    'Xem thêm'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;