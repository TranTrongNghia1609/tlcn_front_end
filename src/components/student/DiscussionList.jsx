import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import discussionService from '@/services/discussionService';
import { toast } from 'sonner';
import {
  MessageSquare,
  Search,
  TrendingUp,
  Clock,
  Pin,
  Lock,
  Eye,
  Heart,
  Filter
} from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const DiscussionList = ({ classCode, loading: parentLoading }) => {
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, announcement, question, discussion
  const [sortBy, setSortBy] = useState('createdAt'); // createdAt, commentCount, viewCount

  useEffect(() => {
    if (classCode) {
      fetchDiscussions();
    }
  }, [classCode, filterType, sortBy]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const params = {
        sortBy,
        sortOrder: 'desc'
      };

      if (filterType !== 'all') {
        params.type = filterType;
      }

      const response = await discussionService.getDiscussions(classCode, params);
      setDiscussions(response.data?.discussions || []);
    } catch (error) {
      console.error('Error fetching discussions:', error);
      toast.error('Không thể tải danh sách thảo luận');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscussionClick = (discussionId) => {
    navigate(`/classrooms/${classCode}/discussions/${discussionId}`);
  };

  const getTypeBadge = (type, priority = 'normal') => {
    const badges = {
      announcement: {
        urgent: { color: 'bg-red-100 text-red-800 border-red-200', label: '🔴 Khẩn' },
        important: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: '🟠 Quan trọng' },
        normal: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: '📢 Thông báo' }
      },
      question: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: '❓ Câu hỏi' },
      discussion: { color: 'bg-green-100 text-green-800 border-green-200', label: '💬 Thảo luận' },
      material: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: '📚 Tài liệu' }
    };

    let badge;
    if (type === 'announcement') {
      badge = badges.announcement[priority] || badges.announcement.normal;
    } else {
      badge = badges[type] || badges.discussion;
    }

    return (
      <Badge variant="outline" className={`${badge.color} border text-xs`}>
        {badge.label}
      </Badge>
    );
  };

  const filteredDiscussions = discussions.filter(disc =>
    disc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    disc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || parentLoading) {
    return (
      <Card className="p-12">
        <LoadingSpinner />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Tìm kiếm thảo luận..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              Tất cả
            </Button>
            <Button
              variant={filterType === 'announcement' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('announcement')}
            >
              📢 Thông báo
            </Button>
            <Button
              variant={filterType === 'question' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('question')}
            >
              ❓ Câu hỏi
            </Button>
            <Button
              variant={filterType === 'discussion' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('discussion')}
            >
              💬 Thảo luận
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy('createdAt')}
              className={sortBy === 'createdAt' ? 'bg-blue-50' : ''}
            >
              <Clock size={16} className="mr-1" />
              Mới nhất
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy('commentCount')}
              className={sortBy === 'commentCount' ? 'bg-blue-50' : ''}
            >
              <TrendingUp size={16} className="mr-1" />
              Phổ biến
            </Button>
          </div>
        </div>
      </Card>

      {/* Discussions List */}
      {filteredDiscussions.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium mb-1">Chưa có thảo luận nào</p>
          <p className="text-sm text-gray-400">
            {searchQuery ? 'Không tìm thấy kết quả phù hợp' : 'Hãy là người đầu tiên tạo thảo luận!'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredDiscussions.map((discussion) => (
            <Card
              key={discussion._id}
              className="p-5 hover:shadow-md transition-all cursor-pointer border-l-4 hover:border-l-blue-500"
              onClick={() => handleDiscussionClick(discussion._id)}
            >
              <div className="flex items-start gap-4">
                <img
                  src={discussion.author?.avatar || '/default-avatar.png'}
                  alt={discussion.author?.fullName}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                  onError={(e) => { e.target.src = '/default-avatar.png'; }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {discussion.isPinned && (
                      <Pin size={16} className="text-blue-600" />
                    )}
                    {getTypeBadge(discussion.type, discussion.priority)}
                    {discussion.isLocked && (
                      <Lock size={14} className="text-gray-400" />
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                    {discussion.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {discussion.content}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                    <span className="font-medium text-gray-700">
                      {discussion.author?.fullName || discussion.author?.userName}
                    </span>
                    <span>
                      {formatDistanceToNow(new Date(discussion.createdAt), {
                        addSuffix: true,
                        locale: vi
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {discussion.stats?.totalViews || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      {discussion.commentsCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} />
                      {discussion.stats?.totalReactions || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionList;