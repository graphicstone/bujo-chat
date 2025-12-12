/**
 * Toast Component
 * Displays temporary notification messages
 */

import { useEffect } from 'react';

const Toast = ({ message, onClose, type = 'info' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    info: 'bg-blue-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-white',
    error: 'bg-red-600 text-white',
  };

  return (
    <div className="animate-slide-in-from-bottom-2 animate-fade-in">
      <div
        className={`${typeStyles[type]} px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}
      >
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 cursor-pointer"
          aria-label="Close toast"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;

