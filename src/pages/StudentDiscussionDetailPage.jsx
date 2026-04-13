import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/Textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import discussionService from '@/services/discussionService';
import { toast } from 'sonner';
import {
  ArrowLeft,
  MessageSquare,
  Heart,
  Eye,
  Pin,
  Lock,
  FileText,
  Download,
  Send
} from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import DiscussionCommentSection from '@/components/student/discussion/DiscussionCommentSection'; // ✅ ADD
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useAuth } from '@/context/AuthContext';

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false,
  sanitize: false
});

const StudentDiscussionDetailPage = () => {
  const { classCode, discussionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (discussionId && classCode) {
      fetchDiscussionDetail();
    }
  }, [discussionId, classCode]);

  const fetchDiscussionDetail = async () => {
    try {
      setLoading(true);
      const response = await discussionService.getDiscussionById(classCode, discussionId);
      const discussionData = response.data?.discussion || response.discussion;
      setDiscussion(discussionData);
    } catch (error) {
      console.error('Error fetching discussion:', error);
      toast.error('Không thể tải chi tiết bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      toast.error('Vui lòng nhập nội dung bình luận');
      return;
    }

    try {
      setSubmitting(true);
      await discussionService.addComment(classCode, discussionId, {
        content: commentText
      });
      
      toast.success('Đã thêm bình luận');
      setCommentText('');
      fetchDiscussionDetail();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error.response?.data?.message || 'Không thể thêm bình luận');
    } finally {
      setSubmitting(false);
    }
  };

  const renderMarkdown = (markdown) => {
    if (!markdown) return '';
    try {
      const rawHtml = marked.parse(markdown);
      return DOMPurify.sanitize(rawHtml);
    } catch (error) {
      console.error('Error rendering markdown:', error);
      return '<p>Không thể hiển thị nội dung</p>';
    }
  };

  const getTypeBadge = (type, priority = 'normal') => {
    const badges = {
      announcement: {
        urgent: { color: 'bg-red-100 text-red-800 border-red-200', label: '🔴 Thông báo khẩn' },
        important: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: '🟠 Thông báo quan trọng' },
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
      <Badge variant="outline" className={`${badge.color} border font-medium text-sm`}>
        {badge.label}
      </Badge>
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <MessageSquare size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Không tìm thấy bài viết
        </h2>
        <Button onClick={() => navigate(`/classrooms/${classCode}/discussions`)}>
          <ArrowLeft size={16} className="mr-2" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const totalComments = discussion.commentsCount || discussion.stats?.totalComments || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/classrooms/${classCode}/discussions`)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-2" />
            Quay lại
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-8">
            {/* Post Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {getTypeBadge(discussion.type, discussion.priority)}
                {discussion.isPinned && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Pin size={14} className="mr-1" />
                    Đã ghim
                  </Badge>
                )}
                {discussion.isLocked && (
                  <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                    <Lock size={14} className="mr-1" />
                    Đã khóa
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {discussion.title}
              </h1>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-gray-200">
              <Avatar className="w-12 h-12">
                <AvatarImage src={discussion.author?.avatar} />
                <AvatarFallback>
                  {discussion.author?.fullName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {discussion.author?.fullName || discussion.author?.userName}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                  <span>
                    {formatDistanceToNow(new Date(discussion.createdAt), {
                      addSuffix: true,
                      locale: vi
                    })}
                  </span>
                  {discussion.isEdited && <span>· Đã chỉnh sửa</span>}
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {discussion.stats?.totalViews || 0} lượt xem
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none mb-6"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(discussion.content)
              }}
            />

            {/* Tags */}
            {discussion.tags && discussion.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {discussion.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Attachments */}
            {discussion.attachments && discussion.attachments.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText size={18} />
                  Tệp đính kèm ({discussion.attachments.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {discussion.attachments.map((file, index) => (
                    <a
                      key={index}
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                    >
                      <FileText size={24} className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {file.fileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.fileSize)}
                        </p>
                      </div>
                      <Download size={18} className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Display */}
            <div className="py-4 border-y border-gray-200">
              <div className="flex items-center divide-x divide-gray-300">
                <span className="flex items-center gap-2 pr-6 text-sm text-gray-600">
                  <Heart size={18} className="text-red-500" />
                  <span className="font-medium text-gray-900">
                    {discussion.stats?.totalReactions || 0}
                  </span>
                  <span>reactions</span>
                </span>
                <span className="flex items-center gap-2 pl-6 text-sm text-gray-600">
                  <MessageSquare size={18} className="text-blue-500" />
                  <span className="font-medium text-gray-900">{totalComments}</span>
                  <span>bình luận</span>
                </span>
              </div>
            </div>

            {/*  ADD: Comment Form (above comment section) */}
            {!discussion.isLocked && discussion.allowComments && user && (
              <form onSubmit={handleSubmitComment} className="mt-6">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.fullName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Viết bình luận..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows={3}
                      className="resize-none mb-2"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={submitting || !commentText.trim()}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {submitting ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Đang gửi...
                          </>
                        ) : (
                          <>
                            <Send size={16} className="mr-2" />
                            Gửi bình luận
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        <DiscussionCommentSection
          classCode={classCode}
          discussionId={discussionId}
          comments={discussion.comments || []}
          totalComments={totalComments}
          isLocked={discussion.isLocked}
          allowComments={discussion.allowComments}
          currentUser={user}
          onCommentsUpdate={fetchDiscussionDetail}
        />
      </div>
    </div>
  );
};

export default StudentDiscussionDetailPage;