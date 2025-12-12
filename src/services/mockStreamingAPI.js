/**
 * Mock Streaming API Service
 * Simulates a streaming API response by returning chunks of text over time
 */
const getMockResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('button') || lowerMessage.includes('btn')) {
    if (lowerMessage.includes('primary') || lowerMessage.includes('secondary') || lowerMessage.includes('ghost')) {
      return {
        text: "Here are different button variants:\n\n<component type=\"button-group\">\n  <button variant=\"primary\" text=\"Primary Button\" />\n  <button variant=\"secondary\" text=\"Secondary Button\" />\n  <button variant=\"ghost\" text=\"Ghost Button\" />\n</component>\n\nThese buttons demonstrate different styles and use cases in a design system.",
        components: ['button-group']
      };
    }
    return {
      text: "Here are different types of button components:\n\n<component type=\"button-group\">\n  <button variant=\"primary\" text=\"Primary\" />\n  <button variant=\"secondary\" text=\"Secondary\" />\n  <button variant=\"ghost\" text=\"Ghost\" />\n  <button variant=\"danger\" text=\"Danger\" />\n  <button variant=\"outline\" text=\"Outline\" />\n</component>\n\nEach button variant serves a different purpose in your UI.",
      components: ['button-group']
    };
  }

  if (lowerMessage.includes('chat') && (lowerMessage.includes('bubble') || lowerMessage.includes('message'))) {
    return {
      text: "Here are variations of chat bubbles:\n\n<component type=\"chat-examples\">\n  <chat-bubble type=\"user\" message=\"This is a user message\" />\n  <chat-bubble type=\"assistant\" message=\"This is an assistant message\" />\n  <chat-bubble type=\"system\" message=\"This is a system message\" />\n</component>\n\nThese demonstrate different message types in a chat interface.",
      components: ['chat-examples']
    };
  }

  return {
    text: "I'm a UI librarian assistant! I can help you explore component libraries.\n\nTry asking me:\n- \"Show me different types of button components\"\n- \"Show me variations of chat bubbles\"\n- \"Show me a primary, secondary, and ghost button\"\n\nI'll render interactive components based on your queries!",
    components: []
  };
};

/**
 * Streams a response chunk by chunk
 * @param {string} userMessage - The user's message
 * @param {function} onChunk - Callback for each chunk
 * @param {function} onComplete - Callback when streaming is complete
 */
export const streamResponse = async (userMessage, onChunk, onComplete) => {
  const response = getMockResponse(userMessage);
  const words = response.text.split(' ');
  let currentIndex = 0;

  const streamInterval = setInterval(() => {
    if (currentIndex < words.length) {
      const chunk = (currentIndex === 0 ? words[currentIndex] : ' ' + words[currentIndex]);
      onChunk(chunk);
      currentIndex++;
    } else {
      clearInterval(streamInterval);
      setTimeout(() => {
        onComplete({
          fullText: response.text,
          components: response.components
        });
      }, 100);
    }
  }, 50);
};

