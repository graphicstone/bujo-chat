/**
 * Storage Service for Chat History
 * Handles localStorage operations for persisting chat messages
 */

const STORAGE_KEY = 'ui-library-chat-history';

/**
 * Save chat history to localStorage
 * @param {Array} messages - Array of message objects
 */
export const saveChatHistory = (messages) => {
  try {
    const serialized = JSON.stringify(messages);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save chat history:', error);
  }
};

/**
 * Load chat history from localStorage
 * @returns {Array} Array of message objects or empty array
 */
export const loadChatHistory = () => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized) {
      return JSON.parse(serialized);
    }
  } catch (error) {
    console.error('Failed to load chat history:', error);
  }
  return [];
};

/**
 * Clear chat history from localStorage
 */
export const clearChatHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear chat history:', error);
  }
};

