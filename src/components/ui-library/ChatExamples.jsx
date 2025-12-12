/**
 * ChatExamples Component
 * Container for displaying different chat bubble variants
 */

import ChatBubble from './ChatBubble';

const ChatExamples = ({ bubbles = [] }) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      {bubbles.map((bubble, index) => (
        <div
          key={index}
          className={`flex outline-none focus:outline-none cursor-default ${bubble.bubbleType === 'user' ? 'justify-end' : bubble.bubbleType === 'system' ? 'justify-center' : 'justify-start'}`}
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
        >
          <ChatBubble
            type={bubble.bubbleType}
            message={bubble.message}
          />
        </div>
      ))}
    </div>
  );
};

export default ChatExamples;

