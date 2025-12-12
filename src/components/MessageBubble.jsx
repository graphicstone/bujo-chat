/**
 * MessageBubble Component
 * Displays individual chat messages (user and assistant)
 */

import ComponentRenderer from './ComponentRenderer';

const MessageBubble = ({ message, isUser }) => {
  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] md:max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-3 md:px-4 py-2 rounded-lg animate-slide-in-from-bottom-2 animate-fade-in ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
        >
          <p className="text-xs md:text-sm whitespace-pre-wrap break-words">{message.text}</p>
          
          {/* Render components if present */}
          {message.components && message.components.length > 0 && (
            <ComponentRenderer components={message.components} />
          )}
        </div>
        <span className={`text-xs text-gray-500 mt-1 block ${isUser ? 'text-right' : 'text-left'}`}>
          {isUser ? 'You' : 'Assistant'}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;

