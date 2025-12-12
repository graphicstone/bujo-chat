/**
 * ChatPanel Component
 * Main chat interface container
 */

import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatPanel = ({ messages, isStreaming, currentStreamingMessage, onSend, onClose }) => {
  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-6 md:w-96 md:h-[600px] bg-white md:rounded-lg shadow-2xl flex flex-col z-40 md:border border-gray-200 animate-slide-in-from-bottom-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 bg-blue-600 text-white md:rounded-t-lg">
        <h2 className="text-base md:text-lg font-semibold">UI Library Assistant</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 p-1 cursor-pointer"
          aria-label="Close chat"
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

      {/* Messages */}
      <MessageList messages={messages} isStreaming={isStreaming} currentStreamingMessage={currentStreamingMessage} />

      {/* Input */}
      <ChatInput onSend={onSend} disabled={isStreaming} />
    </div>
  );
};

export default ChatPanel;

