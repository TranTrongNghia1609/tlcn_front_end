import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="max-w-6xl mx-auto py-6 sm:py-8 px-4">
      <div className="text-center">
        <h2 className="text-6xl font-bold text-gray-800 mb-4">404</h2>
        <h3 className="text-2xl font-semibold text-gray-600 mb-4">
          Trang không tồn tại
        </h3>
        <p className="text-gray-500 mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </main>
  );
};

export default NotFound;