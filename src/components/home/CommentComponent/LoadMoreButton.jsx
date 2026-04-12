import React from 'react';

const LoadMoreButton = ({ onClick, total, loaded, isLoading = false }) => {
  const remaining = total - loaded;
  
  return (
    <div className="flex justify-center my-4">
      <button
        onClick={onClick}
        disabled={isLoading}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
          ${isLoading 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 active:bg-blue-200'
          }
        `}
        // Thêm style thêm để đảm bảo nút có thể bấm được
        style={{ cursor: isLoading ? 'not-allowed' : 'pointer', minWidth: '120px' }}
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span>Loading...</span>
          </div>
        ) : (
          <span>
            Load more {remaining > 0 ? `(${remaining})` : ''}
          </span>
        )}
      </button>
    </div>
  );
};

export default LoadMoreButton;