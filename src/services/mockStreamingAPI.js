/**
 * Mock Streaming API Service
 * Simulates a streaming API response by returning chunks of text over time
 * Enhanced with smart fuzzy matching and multiple component type support
 */

/**
 * Simple fuzzy matching helper - checks if query contains similar words
 * Handles common typos and variations (e.g., "buton" -> "button")
 * @param {string} query - User query
 * @param {string[]} keywords - Array of keywords to match against
 * @returns {boolean} True if any keyword matches (with typo tolerance)
 */
const fuzzyMatch = (query, keywords) => {
  // Direct substring match (most common case) - use word boundaries for better accuracy
  if (keywords.some(k => {
    // Check for whole word match or as part of a longer word (but not scattered)
    const regex = new RegExp(`\\b${k}\\w*|\\w*${k}\\b`, 'i');
    return regex.test(query);
  })) return true;
  
  // Fuzzy matching: only for likely typos (similar length, high character overlap)
  for (const keyword of keywords) {
    if (keyword.length < 4) continue; // Skip short keywords to avoid false positives
    
    // Only do fuzzy matching if query length is similar to keyword length
    // (prevents "hi there" matching "item")
    const lengthDiff = Math.abs(query.length - keyword.length);
    if (lengthDiff > keyword.length * 0.5) continue; // Too different in length
    
    // Check if query has most characters of keyword in order (with stricter matching)
    let queryIndex = 0;
    let matchedChars = 0;
    let consecutiveMatches = 0;
    let maxConsecutive = 0;
    
    for (let i = 0; i < keyword.length && queryIndex < query.length; i++) {
      if (query[queryIndex] === keyword[i]) {
        matchedChars++;
        consecutiveMatches++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveMatches);
        queryIndex++;
      } else {
        consecutiveMatches = 0; // Reset consecutive counter
        // Skip non-matching chars in query (typo tolerance)
        queryIndex++;
        i--; // Retry same keyword char
        if (queryIndex >= query.length) break;
      }
    }
    
    // Stricter matching: need 80%+ match AND at least 2 consecutive chars
    if (matchedChars / keyword.length >= 0.8 && maxConsecutive >= 2) return true;
  }
  
  return false;
};

/**
 * Check if query contains any of the given keywords (with fuzzy matching)
 * @param {string} query - User query
 * @param {string[]} keywords - Keywords to match
 * @returns {boolean}
 */
const containsAny = (query, keywords) => {
  return keywords.some(k => query.includes(k)) || fuzzyMatch(query, keywords);
};

const getMockResponse = (userMessage) => {
  // Edge case: handle empty or very short messages
  if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
    return {
      text: `I'm a UI librarian assistant! I can help you explore component libraries.\n\nTry asking me for:\n- Button examples\n- Forms with input fields\n- Lists (ordered or unordered)\n- Chat bubbles\n- UI component examples\n\nI'll render interactive components based on your queries!`
    };
  }
  
  // Edge case: enforce character limit (200 characters) - truncate if exceeded
  const MAX_CHARACTERS = 200;
  if (userMessage.length > MAX_CHARACTERS) {
    userMessage = userMessage.substring(0, MAX_CHARACTERS);
  }
  
  // Normalize: lowercase, trim, remove extra spaces
  const lowerMessage = userMessage.toLowerCase().trim().replace(/\s+/g, ' ');

  // --- Intent keyword/synonym definitions ---
  // Button-related synonyms
  const buttonKeywords = ['button', 'btn', 'buttons', 'press', 'click'];
  // All available button variants
  const allButtonVariants = ['primary', 'secondary', 'ghost', 'danger', 'outline'];
  
  // Chat-related synonyms
  const chatKeywords = ['chat', 'bubble', 'bubbles', 'message', 'messages', 'conversation'];
  
  // Form-related synonyms
  const formKeywords = ['form', 'input', 'field', 'fields', 'submit', 'textfield', 'text input'];
  
  // List-related synonyms
  const listKeywords = ['list', 'lists', 'item', 'items', 'ordered', 'unordered', 'bullet'];
  
  // Example/generic/component-related
  const exampleKeywords = ['example', 'demo', 'show', 'display', 'give', 'render'];
  const genericUiKeywords = ['component', 'ui', 'something', 'cool', 'feature', 'element'];
  
  // Question words that indicate intent to explore
  const questionKeywords = ['what', 'how', 'can', 'could', 'would', 'do you have', 'available'];

  /**
   * Parse button variant requests from user query
   * Handles: individual variants, "all", combinations (and/or/comma-separated)
   * @param {string} query - User query
   * @returns {string[]} Array of requested variant names
   */
  const parseButtonVariants = (query) => {
    // Check for "all" keyword
    if (query.includes('all') && (query.includes('button') || query.includes('variant'))) {
      return allButtonVariants;
    }
    
    // Extract requested variants by checking which ones are mentioned
    const requestedVariants = [];
    for (const variant of allButtonVariants) {
      // Check if variant name appears in query (with word boundaries to avoid partial matches)
      const variantRegex = new RegExp(`\\b${variant}\\b`, 'i');
      if (variantRegex.test(query)) {
        requestedVariants.push(variant);
      }
    }
    
    // If specific variants were found, return them
    if (requestedVariants.length > 0) {
      return requestedVariants;
    }
    
    // Default: return all variants if no specific request
    return allButtonVariants;
  };

  // --- Button intent block ---
  if (
    containsAny(lowerMessage, buttonKeywords) ||
    (containsAny(lowerMessage, exampleKeywords) && containsAny(lowerMessage, buttonKeywords))
  ) {
    const requestedVariants = parseButtonVariants(lowerMessage);
    const variantCount = requestedVariants.length;
    
    // Generate appropriate response text based on what was requested
    let responseText = '';
    if (variantCount === 1) {
      responseText = `Here's the ${requestedVariants[0]} button:\n\n{\n  "type": "button-group",\n  "variants": ${JSON.stringify(requestedVariants)}\n}\n\nThis is the ${requestedVariants[0]} button variant.`;
    } else if (variantCount === allButtonVariants.length) {
      responseText = `Here are all available button variants:\n\n{\n  "type": "button-group",\n  "variants": ${JSON.stringify(requestedVariants)}\n}\n\nEach button variant serves a different purpose in your UI.`;
    } else {
      const variantList = requestedVariants.join(', ');
      responseText = `Here are the requested button variants:\n\n{\n  "type": "button-group",\n  "variants": ${JSON.stringify(requestedVariants)}\n}\n\nThese buttons (${variantList}) demonstrate different styles and use cases.`;
    }
    
    return {
      text: responseText,
    };
  }

  // --- Greeting/small talk check (route to fallback early) ---
  const greetingKeywords = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
  const isShortGreeting = greetingKeywords.some(g => lowerMessage.includes(g)) && lowerMessage.length < 20;
  
  // Skip all intent checks if it's just a greeting (fall through to final fallback)
  if (isShortGreeting) {
    // Will fall through to final fallback
  } else {
    // --- List intent block (check BEFORE generic fallbacks) ---
    // Must check early to catch "ordered list", "show me list", etc.
    // Require explicit "list" or "item" keyword (not just fuzzy match) to avoid false positives
    const hasExplicitListKeyword = lowerMessage.includes('list') || lowerMessage.includes('item') || 
      lowerMessage.includes('ordered') || lowerMessage.includes('unordered') || 
      lowerMessage.includes('bullet') || lowerMessage.includes('numbered');
    
    const hasListIntent = hasExplicitListKeyword && (
      containsAny(lowerMessage, listKeywords) || 
      (containsAny(lowerMessage, exampleKeywords) && hasExplicitListKeyword) ||
      (lowerMessage.includes('show') && hasExplicitListKeyword) ||
      (lowerMessage.includes('display') && hasExplicitListKeyword)
    );
    
    if (hasListIntent) {
      const isOrdered = lowerMessage.includes('ordered') || lowerMessage.includes('numbered') || lowerMessage.includes('ol');
      const isUnordered = lowerMessage.includes('unordered') || lowerMessage.includes('ul') || lowerMessage.includes('bullet');
      // If explicitly unordered, use unordered; otherwise default based on "ordered" keyword
      const ordered = isUnordered ? false : isOrdered;
      
      return {
        text: `Here's an example ${ordered ? 'ordered' : 'unordered'} list:\n\n{\n  "type": "list",\n  "items": [\n    "First item in the list",\n    "Second item with more details",\n    "Third item demonstrating list structure"\n  ],\n  "ordered": ${ordered},\n  "style": "default"\n}\n\nLists are great for displaying structured information.`
      };
    }
  }

  // --- Chat/bubble/message intent block (check BEFORE form/question to avoid conflicts) ---
  // Require explicit chat-related keywords for consistency with list intent
  // Allow "component" in query (e.g., "chat component examples" is valid)
  if (!isShortGreeting) {
    const hasExplicitChatKeyword = lowerMessage.includes('chat') || lowerMessage.includes('bubble') || 
      lowerMessage.includes('message') || lowerMessage.includes('conversation');
    
    const hasChatIntent = hasExplicitChatKeyword && (
      containsAny(lowerMessage, chatKeywords) ||
      (containsAny(lowerMessage, exampleKeywords) && hasExplicitChatKeyword) ||
      (lowerMessage.includes('show') && hasExplicitChatKeyword) ||
      (lowerMessage.includes('display') && hasExplicitChatKeyword)
    );
    
    if (hasChatIntent) {
      return {
        text: `Here are variations of chat bubbles:\n\n{\n  "type": "chat-examples",\n  "bubbles": [\n    { "type": "user", "message": "This is a user message" },\n    { "type": "assistant", "message": "This is an assistant message" },\n    { "type": "system", "message": "This is a system message" }\n  ]\n}\n\nThese demonstrate different message types in a chat interface.`
      };
    }
  }

  // --- Form/Input intent block ---
  if (
    containsAny(lowerMessage, formKeywords) ||
    (containsAny(lowerMessage, exampleKeywords) && containsAny(lowerMessage, formKeywords))
  ) {
    return {
      text: `Here's an example form with input fields:\n\n{\n  "type": "form",\n  "fields": [\n    { "name": "name", "label": "Name", "placeholder": "Enter your name", "type": "text" },\n    { "name": "email", "label": "Email", "placeholder": "Enter your email", "type": "email" },\n    { "name": "age", "label": "Age", "placeholder": "Enter your age", "type": "number" }\n  ],\n  "submitText": "Submit"\n}\n\nThis form demonstrates input fields with labels and a submit button.`
    };
  }

  // --- Handle question-based queries ("what components", "how do I", etc.) ---
  // Check AFTER chat to avoid "what chat bubbles" matching question intent
  if (containsAny(lowerMessage, questionKeywords)) {
    // If asking about available components, show a helpful response
    if (lowerMessage.includes('component') || lowerMessage.includes('available') || (lowerMessage.includes('what') && lowerMessage.includes('have'))) {
      return {
        text: `I can show you various UI components! Here's a button example:\n\n{\n  "type": "button-group",\n  "variants": ["primary", "secondary", "ghost"]\n}\n\nYou can also ask for:\n- Forms with input fields\n- Lists (ordered or unordered)\n- Chat bubbles\n- More button variations\n\nJust ask and I'll render them for you!`
      };
    }
    // Generic question - default to button example
    return {
      text: `Here's a UI component example:\n\n{\n  "type": "button-group",\n  "variants": ["primary", "secondary", "ghost"]\n}\n\nTry asking for forms, lists, or chat bubbles too!`
    };
  }

  // --- Catch general/generic queries ("show something", "example", "ui", etc.) ---
  if (
    containsAny(lowerMessage, exampleKeywords) ||
    containsAny(lowerMessage, genericUiKeywords)
  ) {
    // Return a default demo: button group example
    return {
      text: `Here's a UI component example:\n\n{\n  "type": "button-group",\n  "variants": ["primary", "secondary", "ghost"]\n}\n\nYou can also ask for forms, lists, or chat bubbles!`
    };
  }

  // --- Fallback for unknown/unsupported queries ---
  return {
    text: `I'm a UI librarian assistant! I can help you explore component libraries.\n\nTry asking me for:\n- Button examples\n- Forms with input fields\n- Lists (ordered or unordered)\n- Chat bubbles\n- UI component examples\n\nI'll render interactive components based on your queries!`
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

