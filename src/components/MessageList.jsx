/**
 * MessageList Component
 * Scrollable container for chat messages
 */

import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import ReactMarkdown from 'react-markdown';
import ComponentRenderer from './ComponentRenderer';

const MessageList = ({ messages, isStreaming, streamBlocks }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, streamBlocks]);

  const showTypingIndicator = isStreaming && (!streamBlocks || streamBlocks.length === 0);

  // Helper to render assistant message blocks
  const renderAssistantBlocks = (blocks) => (
    <div className="space-y-2">
      {blocks.map((block, i) => {
        if (block.type === 'markdown') {
          // Render markdown
          return <div key={i} className="text-xs md:text-sm whitespace-pre-wrap break-words"><ReactMarkdown>{block.content}</ReactMarkdown></div>;
        }
        if (block.type === 'json') {
          // Render interactive component via ComponentRenderer
          return <ComponentRenderer key={i} jsonBlock={block.content} />;
        }
        return null;
      })}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto px-3 md:px-4 py-3 md:py-4 space-y-2">
      {messages.length === 0 && !showTypingIndicator ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p className="text-sm">Start a conversation to explore UI components!</p>
        </div>
      ) : (
        <>
          {messages.map((message, index) => {
            if (message.role === 'user') {
              return <MessageBubble key={index} message={message} isUser />;
            }
            // Assistant message with blocks (Direction B style)
            if (message.role === 'assistant' && message.blocks) {
              return (
                <div key={index} className="flex mb-4 justify-start">
                  <div className="max-w-[85%] md:max-w-[80%] order-1">
                    <div className="px-3 md:px-4 py-2 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none animate-slide-in-from-bottom-2 animate-fade-in">
                      {renderAssistantBlocks(message.blocks)}
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block text-left">Assistant</span>
                  </div>
                </div>
              );
            }
            // Plain-text assistant message fallback (if any remain)
            return <MessageBubble key={index} message={message} isUser={false} />;
          })}
          {showTypingIndicator && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;

