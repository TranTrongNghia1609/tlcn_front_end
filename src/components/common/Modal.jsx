import React from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  maxWidth = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
  title = null,
  className = "",
  size = "default"
 }) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    default: "max-w-md"
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      // Add modal-open class to body
      document.body.classList.add('modal-open');
      // Add event listener for Escape key
      document.addEventListener('keydown', handleEscape);
    } else {
      // Remove modal-open class from body
      document.body.classList.remove('modal-open');
    }

    // Cleanup function
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal Content */}
      <div className={`
        relative z-10 w-full transform transition-all
        ${sizeClasses[size] || sizeClasses[maxWidth] || sizeClasses.default}
        ${className}
      `}>
        
        {/* Header with Title */}
        {title && (
          <div className="bg-white rounded-t-lg px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 "
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Close button without title */}
        {!title && showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Content */}
        <div className={title ? "bg-white rounded-b-lg" : "bg-white rounded-lg"}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;