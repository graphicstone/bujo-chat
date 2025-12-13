/**
 * UiLibraryAssistant Component
 * Main embeddable chat widget component
 * Handles chat state, streaming, and persistence
 */

import { useState, useEffect, useCallback } from 'react';
import ChatIcon from './ChatIcon';
import ChatPanel from './ChatPanel';
import { streamResponse } from '../services/mockStreamingAPI';
import { saveChatHistory, loadChatHistory } from '../services/storageService';
import { parseStreamedAssistantResponse } from '../utils/responseParser';

const MOCK_API_DELAY = 1500;

const UiLibraryAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => loadChatHistory());
  const [isStreaming, setIsStreaming] = useState(false);
  // Store currently streaming blocks (markdown/json objects)
  const [streamBlocks, setStreamBlocks] = useState([]);
  // Buffer for incomplete chunk (for streaming JSON)
  const [streamBuffer, setStreamBuffer] = useState('');

  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  // Handle Send: send user message, stream with block parsing
  const handleSend = useCallback(async (userMessage) => {
    const userMsg = {
      role: 'user',
      text: userMessage
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);
    setStreamBlocks([]);
    setStreamBuffer('');

    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

    let streamAccum = '';
    let buffer = '';
    let allBlocks = [];
    
    await streamResponse(
      userMessage,
      (chunk) => {
        // On each chunk, accumulate; parse completed blocks
        streamAccum += chunk;
        const [parsedBlocks, remaining] = parseStreamedAssistantResponse(chunk, buffer);
        buffer = remaining;
        if (parsedBlocks.length > 0) {
          allBlocks = [...allBlocks, ...parsedBlocks];
          // Display all blocks + show partial
          setStreamBlocks([...allBlocks]);
        }
        setStreamBuffer(buffer);
      },
      ({ fullText }) => {
        // On completion: parse any remaining buffer
        const [finalBlocks] = parseStreamedAssistantResponse('', buffer);
        const completeBlocks = [...allBlocks, ...finalBlocks];
        // Commit full parsed assistant message
        setMessages(prev => [...prev, { role: 'assistant', blocks: completeBlocks }]);
        setIsStreaming(false);
        setStreamBlocks([]);
        setStreamBuffer('');
      }
    );
  }, []);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  // While streaming: show current streamBlocks as a 'streaming' assistant message
  const displayMessages = isStreaming && streamBlocks.length > 0
    ? [...messages, { role: 'assistant', blocks: streamBlocks }]
    : messages;

  return (
    <>
      <ChatIcon onClick={toggleChat} isOpen={isOpen} />
      {isOpen && (
        <ChatPanel
          messages={displayMessages}
          isStreaming={isStreaming}
          streamBlocks={streamBlocks}
          onSend={handleSend}
          onClose={toggleChat}
        />
      )}
    </>
  );
};

export default UiLibraryAssistant;

