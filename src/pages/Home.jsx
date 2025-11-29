import React, { useState, useEffect, useRef, useCallback } from 'react';
import PostCard from '../components/home/PostCard';
import CreatePost from '../components/home/CreatePost';
import Sidebar from '../components/home/Sidebar';
import { useUser } from '../context/UserContext';
import { getPosts } from '../services/postService';
import OnboardingModal from "@/components/auth/OnboardingModel.jsx";
import { Loader2 } from 'lucide-react';

const Home = ({isShowOnboarding = false}) => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState('all');
  const [onboarding, setOnboarding] = useState(isShowOnboarding);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const observerTarget = useRef(null);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1, true);
  }, [filter]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, loadingMore, page]);

  const fetchPosts = async (pageNum = 1, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await getPosts({ 
        filter, 
        page: pageNum, 
        limit: 10 
      });

      const newPosts = response.data.posts;
      const meta = response.data.meta;
      
      // Calculate if has more posts
      const totalPages = Math.ceil(meta.total / meta.limit);
      const hasMorePosts = meta.page < totalPages;

      if (isInitial) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      setHasMore(hasMorePosts);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMorePosts = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, false);
  }, [page, filter]);

  const handleNewPost = (newPost) => {
    // Add new post to beginning of list
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => prev.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handlePostDelete = (postId) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Cộng đồng lập trình
              </h1>
              <p className="text-gray-600">
                Chia sẻ hành trình học lập trình của bạn, thảo luận về các vấn đề và học hỏi cùng nhau
              </p>
            </div>

            <OnboardingModal 
              open={onboarding}
              onClose={() => setOnboarding(false)}
            />

            {/* Create Post */}
            {user && (
              <CreatePost onPostCreated={handleNewPost} />
            )}

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="flex border-b">
                {[
                  { key: 'all', label: 'Bài viết' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`px-6 py-3 font-medium transition-colors ${
                      filter === tab.key
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-6">
              {loading && posts.length === 0 ? (
                // Initial Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))
              ) : posts.length > 0 ? (
                <>
                  {posts.map(post => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onUpdate={handlePostUpdate}
                      onDelete={handlePostDelete}
                    />
                  ))}

                  {/* Loading More Indicator */}
                  {loadingMore && (
                    <div className="flex justify-center py-8">
                      <div className="flex items-center gap-2 text-blue-600">
                        <Loader2 size={20} className="animate-spin" />
                        <span>Đang tải thêm bài viết...</span>
                      </div>
                    </div>
                  )}

                  {/* Intersection Observer Target */}
                  {hasMore && !loadingMore && (
                    <div ref={observerTarget} className="h-10" />
                  )}

                  {/* End of List */}
                  {!hasMore && posts.length > 0 && (
                    <div className="text-center py-8 text-gray-500">
                      🎉 Bạn đã xem hết tất cả bài viết
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <div className="text-gray-400 text-lg mb-2">Chưa có bài viết nào</div>
                  <p className="text-gray-500">Hãy là người đầu tiên chia sẻ!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;