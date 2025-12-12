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
import { parseResponse } from '../utils/responseParser';

const MOCK_API_DELAY = 1500;

const UiLibraryAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => loadChatHistory());
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState(null);

  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  const handleSend = useCallback(async (userMessage) => {
    const userMsg = {
      role: 'user',
      text: userMessage,
      components: []
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);
    setCurrentStreamingMessage('');

    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

    let accumulatedText = '';
    
    await streamResponse(
      userMessage,
      (chunk) => {
        accumulatedText += chunk;
        setCurrentStreamingMessage(accumulatedText);
      },
      ({ fullText }) => {
        const parsed = parseResponse(fullText);
        
        const assistantMsg = {
          role: 'assistant',
          text: parsed.text,
          components: parsed.components
        };
        
        setMessages((prev) => [...prev, assistantMsg]);
        setIsStreaming(false);
        setCurrentStreamingMessage(null);
      }
    );
  }, []);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const displayMessages = isStreaming && currentStreamingMessage
    ? [...messages, { role: 'assistant', text: currentStreamingMessage, components: [] }]
    : messages;

  return (
    <>
      <ChatIcon onClick={toggleChat} isOpen={isOpen} />
      {isOpen && (
        <ChatPanel
          messages={displayMessages}
          isStreaming={isStreaming}
          currentStreamingMessage={currentStreamingMessage}
          onSend={handleSend}
          onClose={toggleChat}
        />
      )}
    </>
  );
};

export default UiLibraryAssistant;

