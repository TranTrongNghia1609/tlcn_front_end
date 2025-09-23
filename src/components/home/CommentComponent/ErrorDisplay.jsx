import React from 'react';

const ErrorDisplay = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-700 text-sm">{error}</p>
      <button
        onClick={onDismiss}
        className="text-red-600 hover:text-red-700 text-xs font-medium mt-1 transition-colors"
      >
        Dismiss
      </button>
    </div>
  );
};

export default ErrorDisplay;