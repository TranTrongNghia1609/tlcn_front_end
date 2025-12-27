import { React, useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useNavigate, } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import HeaderLandingPage from '../components/layout/HeaderLandingPage';
import { getPublicStatistics } from '@/services/statisticsService';
import anh1 from '../assets/anh1.jpg';
import anh2 from '../assets/anh2.jpg';
import anh3 from '../assets/anh3.jpg';
const LandingPage = () => {
  const navigate = useNavigate();
  const { openLogin, openRegister } = useAuthModal();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [stats, setStats] = useState({
    users: 0,
    problems: {
      total: 0,
      easy: 0,
      medium: 0,
      hard: 0
    },
    submissions: 0,
    contests: 0
  });
  const images = [anh1, anh2, anh3];
  const navigationSections = [
    { id: 'about', label: 'Giới thiệu' },
    { id: 'problems', label: 'Bài tập' },
    { id: 'features', label: 'Tính năng' },
    { id: 'testimonials', label: 'Nhận xét' }
  ];
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await getPublicStatistics();
        console.log('📊 Statistics loaded:', response);
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds


    return () => clearInterval(interval);
  }, [images.length]);
  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M+';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K+';
    }
    return num.toString();
  };


  return (
    <div className="min-h-screen bg-white">
      <HeaderLandingPage sections={navigationSections} />

      {/* Hero Section - LeetCode Style */}
      <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 selectable-text">
                <span className="gradient-text">BN</span>{' '}
                <span className="text-gray-900">Online Judge</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 selectable-text leading-relaxed">
                Nền tảng luyện tập lập trình thú vị với hơn{' '} 
                <span className="font-bold text-blue-600">{loading ? '...' : formatNumber(stats.problems.total)}
                  </span> bài tập
              </p>
              <p className="text-lg text-gray-500 mb-10 selectable-text">
                Nâng cao kỹ năng thuật toán, chuẩn bị phỏng vấn và tham gia các kỳ thi lập trình
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/problemset')}
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 hover-lift cursor-pointer"
                >
                  Bắt đầu luyện tập
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/home')}
                  className="text-lg px-8 py-6 hover:border-blue-600 hover:text-blue-600 cursor-pointer"
                >
                  Khám phá
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center hover-lift cursor-pointer">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{loading ? '...' : formatNumber(stats.users)}</div>
                  <div className="text-sm text-gray-600 selectable-text">Người dùng</div>
                </div>
                <div className="text-center hover-lift cursor-pointer">
                  <div className="text-3xl font-bold text-purple-600 mb-1"> 
                    {loading ? '...' : formatNumber(stats.problems.total)}
                    </div>
                  <div className="text-sm text-gray-600 selectable-text">Bài tập</div>
                </div>
                <div className="text-center hover-lift cursor-pointer">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">
                    {loading ? '...' : formatNumber(stats.submissions)}
                    </div>
                  <div className="text-sm text-gray-600 selectable-text">Bài nộp</div>
                </div>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="hidden lg:block float-animation">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-3xl transform rotate-6 opacity-20"></div>
                <Card className="relative bg-white p-8 rounded-3xl shadow-2xl border-2 border-gray-100">
                  {/* Code Editor Mock */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="font-mono text-sm space-y-2">
                      <div className="text-purple-600">function <span className="text-blue-600">twoSum</span>(nums, target) {'{'}</div>
                      <div className="pl-4 text-gray-600">const map = new Map();</div>
                      <div className="pl-4 text-purple-600">for <span className="text-gray-600">(let i = 0; i {'<'} nums.length; i++)</span> {'{'}</div>
                      <div className="pl-8 text-blue-600">return <span className="text-gray-600">[map.get(complement), i];</span></div>
                      <div className="pl-4">{'}'}</div>
                      <div className="text-purple-600">{'}'}</div>
                    </div>
                    <div className="mt-6 flex items-center justify-between pt-4 border-t">
                      <span className="text-green-600 font-semibold">✓ Accepted</span>
                      <span className="text-sm text-gray-500">Runtime: 52ms</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 selectable-text">
              Về BN Online Judge
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto selectable-text">
              Nền tảng học tập lập trình được thiết kế để giúp bạn phát triển kỹ năng coding
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="hover-lift p-6 rounded-xl hover:bg-blue-50 transition-all cursor-pointer">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 selectable-text flex items-center">
                  <span className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                    </svg>
                  </span>
                  Học tập hiệu quả
                </h3>
                <p className="text-gray-600 selectable-text leading-relaxed">
                  Hệ thống bài tập được phân loại theo độ khó và chủ đề, giúp bạn học tập có hệ thống từ cơ bản đến nâng cao
                </p>
              </div>

              <div className="hover-lift p-6 rounded-xl hover:bg-purple-50 transition-all cursor-pointer">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 selectable-text flex items-center">
                  <span className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                    </svg>
                  </span>
                  Chấm bài tự động
                </h3>
                <p className="text-gray-600 selectable-text leading-relaxed">
                  Hệ thống chấm bài tự động với phản hồi chi tiết, giúp bạn biết chính xác lỗi sai và cải thiện code
                </p>
              </div>

              <div className="hover-lift p-6 rounded-xl hover:bg-indigo-50 transition-all cursor-pointer">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 selectable-text flex items-center">
                  <span className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>
                  </span>
                  Cộng đồng sôi động
                </h3>
                <p className="text-gray-600 selectable-text leading-relaxed">
                  Tham gia cộng đồng lập trình viên, chia sẻ kinh nghiệm và học hỏi từ những người khác
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl transform rotate-3"></div>

              {/* Carousel Container */}
              <div className="relative rounded-3xl shadow-2xl overflow-hidden bg-white">
                {/* Images */}
                <div className="relative h-96 md:h-[500px]">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                      <img
                        src={image}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Previous Button */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-800">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                </button>

                {/* Next Button */}
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-800">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`transition-all ${index === currentImageIndex
                        ? 'w-8 bg-blue-600'
                        : 'w-2 bg-white/60 hover:bg-white'
                        } h-2 rounded-full`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Preview Section */}
      <section id="problems" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 selectable-text">
              Bài tập lập trình
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto selectable-text">
              Từ cơ bản đến nâng cao, luyện tập với hàng nghìn bài tập chất lượng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Easy */}
            <Card className="p-8 text-center hover-lift bg-white cursor-pointer">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">E</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 selectable-text">Easy</h3>
              <p className="text-3xl font-bold text-green-600 mb-2">
                {loading ? '...' : stats.problems.easy.toLocaleString()}
              </p>
              <p className="text-gray-600 selectable-text">bài tập cơ bản</p>
            </Card>

            {/* Medium */}
            <Card className="p-8 text-center hover-lift bg-white cursor-pointer">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">M</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 selectable-text">Medium</h3>
              <p className="text-3xl font-bold text-yellow-600 mb-2">
                {loading ? '...' : stats.problems.medium.toLocaleString()}
              </p>
              <p className="text-gray-600 selectable-text">bài tập trung bình</p>
            </Card>

            {/* Hard */}
            <Card className="p-8 text-center hover-lift bg-white cursor-pointer">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">H</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 selectable-text">Hard</h3>
              <p className="text-3xl font-bold text-red-600 mb-2">
                {loading ? '...' : stats.problems.hard.toLocaleString()}
              </p>
              <p className="text-gray-600 selectable-text">bài tập nâng cao</p>
            </Card>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => navigate('/problemset')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 cursor-pointer"
            >
              Xem tất cả bài tập
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 selectable-text">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto selectable-text">
              Công cụ và tính năng giúp bạn học tập hiệu quả hơn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                  </svg>
                ),
                title: 'Code Editor',
                description: 'Trình soạn thảo code mạnh mẽ với syntax highlighting và auto-complete',
                color: 'blue'
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                  </svg>
                ),
                title: 'Contest',
                description: 'Tham gia các cuộc thi lập trình và cạnh tranh với người khác',
                color: 'purple'
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                  </svg>
                ),
                title: 'Progress Tracking',
                description: 'Theo dõi tiến độ học tập với biểu đồ và thống kê chi tiết',
                color: 'indigo'
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                ),
                title: 'Solutions',
                description: 'Xem lời giải chi tiết từ cộng đồng sau khi hoàn thành bài tập',
                color: 'green'
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                ),
                title: 'Discussion',
                description: 'Thảo luận và chia sẻ kinh nghiệm với cộng đồng',
                color: 'pink'
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                ),
                title: 'Leaderboard',
                description: 'Bảng xếp hạng toàn cầu và theo từng contest',
                color: 'yellow'
              }
            ].map((feature, index) => (
              <Card
                key={index}
                className={`p-8 hover-lift bg-white border-2 border-transparent hover:border-${feature.color}-200 transition-all cursor-pointer`}
              >
                <div className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-6 text-${feature.color}-600`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 selectable-text">
                  {feature.title}
                </h3>
                <p className="text-gray-600 selectable-text leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 selectable-text">
              Người dùng nói gì về chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto selectable-text">
              Hàng nghìn người đã cải thiện kỹ năng lập trình cùng BN Online Judge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Hoàng Minh Tuấn',
                role: 'Software Engineer @ Google',
                avatar: 'https://randomuser.me/api/portraits/men/92.jpg',
                rating: 5,
                content: 'BN Online Judge đã giúp tôi chuẩn bị cho các buổi phỏng vấn kỹ thuật một cách hiệu quả. Các bài tập thực tế và hệ thống phản hồi chi tiết giúp tôi hiểu rõ điểm mạnh và điểm yếu của mình.'
              },
              {
                name: 'PGS.TS. Nguyễn Thị Mai',
                role: 'Giảng viên, ĐH CNTT',
                avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
                rating: 5,
                content: 'Là một giảng viên, tôi đã sử dụng BN Online Judge để dạy các khóa học lập trình. Hệ thống quản lý bài tập và chấm điểm tự động giúp tôi tiết kiệm rất nhiều thời gian và tập trung vào việc hỗ trợ sinh viên.'
              },
              {
                name: 'Trần Đình Khôi',
                role: 'Junior Developer @ VNG',
                avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
                rating: 5,
                content: 'BN Online Judge đã thay đổi cách tôi học lập trình. Tôi đặc biệt yêu thích cộng đồng sôi động và sự hỗ trợ từ đội ngũ. Nhờ có nền tảng này, tôi đã nhận được công việc đầu tiên trong ngành IT.'
              }
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="p-8 hover-lift bg-white shadow-lg cursor-pointer"
              >
                <div className="flex mb-6 text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-700 italic mb-6 selectable-text leading-relaxed text-lg">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center pt-6 border-t">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 selectable-text">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 selectable-text">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-xl"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 selectable-text text-gray-900">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-gray-600 selectable-text leading-relaxed">
            Tham gia cùng các lập trình viên đang học tập và phát triển mỗi ngày
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={openRegister}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-12 py-6 hover-lift shadow-2xl cursor-pointer"
            >
              Đăng ký ngay
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/home')}
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-lg px-12 py-6 cursor-pointer transition-all"
            >
              Khám phá ngay
            </Button>
          </div>
        </div>
      </section>

    </div>
    
  );
};

export default LandingPage;