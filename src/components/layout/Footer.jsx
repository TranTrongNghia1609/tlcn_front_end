import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-800 mt-auto border-t border-gray-200">
      <div className="max-w-auto mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-600">BNOJ</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Nền tảng học lập trình trực tuyến với các bài tập và kì thi thú vị.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors" aria-label="GitHub">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-600 transition-colors" aria-label="YouTube">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="mailto:support@bnoj.com" className="text-gray-500 hover:text-blue-600 transition-colors" aria-label="Email">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><Link to="/problemset" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Danh sách bài tập</Link></li>
              <li><Link to="/contests" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Kỳ thi</Link></li>
              <li><Link to="/leaderboard" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Bảng xếp hạng</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Giới thiệu</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Trung tâm trợ giúp</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Câu hỏi thường gặp</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Liên hệ</Link></li>
              <li><Link to="/feedback" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Góp ý</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Pháp lý</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Điều khoản sử dụng</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Chính sách bảo mật</Link></li>
              <li><Link to="/cookies" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Chính sách Cookie</Link></li>
              <li><Link to="/guidelines" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Quy tắc cộng đồng</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm text-center md:text-left">
              © {currentYear} <span className="gradient-text font-semibold">BNOJ</span>. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/sitemap" className="text-gray-600 hover:text-blue-600 transition-colors">Sơ đồ trang</Link>
              <span className="text-gray-400">•</span>
              <Link to="/accessibility" className="text-gray-600 hover:text-blue-600 transition-colors">Truy cập</Link>
              <span className="text-gray-400">•</span>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Ngôn ngữ: Tiếng Việt</a>
            </div>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors group"
              aria-label="Lên đầu trang"
            >
              <span className="text-sm">Lên đầu</span>
              <svg className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs flex items-center justify-center space-x-1">
              <span>Made with</span>
              <span>by BNOJ Team</span>
            </p>
          </div>
        </div>
      </div>

      
    </footer>
  );
};

export default Footer;