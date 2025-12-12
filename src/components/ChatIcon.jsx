/**
 * ChatIcon Component
 * Floating button to toggle chat panel
 */

const ChatIcon = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:scale-110 transition-all duration-200 flex items-center justify-center cursor-pointer z-50 ${
        isOpen ? 'rotate-180' : ''
      }`}
      aria-label="Toggle chat"
    >
      {isOpen ? (
        <svg
          className="w-6 h-6"
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
      ) : (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      )}
    </button>
  );
};

export default ChatIcon;

