/**
 * Mock Streaming API Service
 * Simulates a streaming API response by returning chunks of text over time
 */
const getMockResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();

  // Button-related queries: Return Markdown + JSON describing button group
  if (lowerMessage.includes('button') || lowerMessage.includes('btn')) {
    if (lowerMessage.includes('primary') || lowerMessage.includes('secondary') || lowerMessage.includes('ghost')) {
      return {
        text: `Here are different button variants:

{
  "type": "button-group",
  "variants": ["primary", "secondary", "ghost"]
}

These buttons demonstrate different styles and use cases in a design system.`,
      };
    }
    // More general "button" query - provide extra variants
    return {
      text: `Here are different types of button components:

{
  "type": "button-group",
  "variants": ["primary", "secondary", "ghost", "danger", "outline"]
}

Each button variant serves a different purpose in your UI.`,
    };
  }

  // Chat bubble queries: Markdown + JSON for example chat bubbles
  if (lowerMessage.includes('chat') && (lowerMessage.includes('bubble') || lowerMessage.includes('message'))) {
    return {
      text: `Here are variations of chat bubbles:

{
  "type": "chat-examples",
  "bubbles": [
    { "type": "user", "message": "This is a user message" },
    { "type": "assistant", "message": "This is an assistant message" },
    { "type": "system", "message": "This is a system message" }
  ]
}

These demonstrate different message types in a chat interface.`
    };
  }

  // Default/help response with Markdown only
  return {
    text: `I'm a UI librarian assistant! I can help you explore component libraries.

Try asking me:
- "Show me different types of button components"
- "Show me variations of chat bubbles"
- "Show me a primary, secondary, and ghost button"

I'll render interactive components based on your queries!`
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
  // Split into paragraphs for chunked streaming (double-newline = Markdown block, code block, JSON block)
  const lines = response.text.split(/\r?\n\r?\n/);
  let currentIndex = 0;

  const streamInterval = setInterval(() => {
    if (currentIndex < lines.length) {
      // Each chunk will be a paragraph or block, followed by double newline for correct parsing
      const chunk = lines[currentIndex] + '\n\n';
      onChunk(chunk);
      currentIndex++;
    } else {
      clearInterval(streamInterval);
      setTimeout(() => {
        onComplete({
          fullText: response.text
        });
      }, 100);
    }
  }, 350);
};

