/**
 * ChatInput Component
 * Input field and send button for chat messages
 * Includes character limit (200 characters) and live character count
 */

import { useState } from 'react';

const MAX_CHARACTERS = 200;

const ChatInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const charCount = input.length;
  const isAtCharLimit = charCount >= MAX_CHARACTERS;
  const charsRemaining = MAX_CHARACTERS - charCount;
  // Show warning when 80% of limit is reached (160 characters)
  const isNearLimit = charCount >= MAX_CHARACTERS * 0.8;

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    
    // Enforce character limit - maxLength attribute handles this, but we validate here too
    if (newValue.length <= MAX_CHARACTERS) {
      setInput(newValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput && !disabled && trimmedInput.length > 0 && trimmedInput.length <= MAX_CHARACTERS) {
      onSend(trimmedInput);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 md:p-4">
      <div className="flex flex-col gap-2">
        {/* Input and Send button row */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about UI components..."
            disabled={disabled}
            maxLength={MAX_CHARACTERS}
            className={`flex-1 px-3 md:px-4 py-2 text-sm md:text-base border rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors ${
              isAtCharLimit 
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                : isNearLimit
                ? 'border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            }`}
          />
          <button
            type="submit"
            disabled={disabled || !input.trim() || isAtCharLimit}
            className="px-4 md:px-6 py-2 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        
        {/* Character count display */}
        <div className="flex justify-end items-center text-xs px-1">
          <span className={
            isAtCharLimit 
              ? 'text-red-500 font-medium' 
              : isNearLimit 
              ? 'text-orange-500 font-medium' 
              : 'text-gray-500'
          }>
            {charCount} / {MAX_CHARACTERS} {charCount === 1 ? 'character' : 'characters'}
            {isAtCharLimit && ' (limit reached)'}
            {isNearLimit && !isAtCharLimit && ` (${charsRemaining} remaining)`}
          </span>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;

