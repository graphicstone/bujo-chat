/**
 * Response Parser
 * Parses bot responses to extract component rendering instructions
 */

/**
 * Parse response text to extract component instructions
 * @param {string} text - The response text
 * @returns {Object} Parsed result with text and component data
 */
export const parseResponse = (text) => {
  // Look for component tags in the format: <component type="...">...</component>
  const componentRegex = /<component\s+type="([^"]+)">([\s\S]*?)<\/component>/g;
  const components = [];
  let match;

  while ((match = componentRegex.exec(text)) !== null) {
    const componentType = match[1];
    const componentContent = match[2];

    const elements = parseComponentElements(componentContent, componentType);
    
    components.push({
      type: componentType,
      elements: elements
    });
  }

  const cleanText = text.replace(componentRegex, '').trim();
  
  return {
    text: cleanText,
    components: components
  };
};

/**
 * Parse elements within a component block
 * @param {string} content - The content inside component tags
 * @param {string} componentType - The type of component container
 * @returns {Array} Array of parsed elements
 */
const parseComponentElements = (content, componentType) => {
  const elements = [];
  
  if (componentType === 'button-group') {
    // Parse button elements: <button variant="..." text="..." />
    const buttonRegex = /<button\s+variant="([^"]+)"\s+text="([^"]+)"\s*\/>/g;
    let buttonMatch;
    while ((buttonMatch = buttonRegex.exec(content)) !== null) {
      elements.push({
        type: 'button',
        variant: buttonMatch[1],
        text: buttonMatch[2]
      });
    }
  } else if (componentType === 'chat-examples') {
    // Parse chat bubble elements: <chat-bubble type="..." message="..." />
    const chatRegex = /<chat-bubble\s+type="([^"]+)"\s+message="([^"]+)"\s*\/>/g;
    let chatMatch;
    while ((chatMatch = chatRegex.exec(content)) !== null) {
      elements.push({
        type: 'chat-bubble',
        bubbleType: chatMatch[1],
        message: chatMatch[2]
      });
    }
  }
  
  return elements;
};

/**
 * Streaming parser for assistant responses containing mixed Markdown and JSON blocks.
 *
 * - Assembles complete blocks from streamed text.
 * - Distinguishes between Markdown and JSON.
 * - Gracefully handles JSON split across chunks by buffering incomplete data.
 *
 * Usage:
 *   const [blocks, remainingBuffer] = parseStreamedAssistantResponse(newChunk, previousBuffer);
 */

export function parseStreamedAssistantResponse(incomingText, previousBuffer = '') {
  // Buffer the incoming text
  let buffer = previousBuffer + incomingText;
  const blocks = [];

  // Regular expression to locate JSON blocks (start and end with curly braces)
  const jsonBlockRegex = /{[\s\S]*?}/gm;

  let match;
  let lastIndex = 0;

  // Extract all JSON blocks
  while ((match = jsonBlockRegex.exec(buffer)) !== null) {
    const jsonStart = match.index;
    const jsonEnd = jsonBlockRegex.lastIndex;

    // Markdown between previous index and this JSON
    if (jsonStart > lastIndex) {
      const markdownFragment = buffer.slice(lastIndex, jsonStart).trim();
      if (markdownFragment) {
        blocks.push({ type: 'markdown', content: markdownFragment, raw: markdownFragment });
      }
    }

    // The JSON block itself
    const jsonFragment = match[0];
    try {
      blocks.push({ type: 'json', content: JSON.parse(jsonFragment), raw: jsonFragment });
    } catch (err) {
      // Malformed or partial JSON: emit as markdown with error
      blocks.push({ type: 'markdown', content: jsonFragment, raw: jsonFragment, error: 'invalid-json' });
    }

    lastIndex = jsonEnd;
  }

  // Any trailing markdown (or possibly incomplete JSON)
  if (lastIndex < buffer.length) {
    const trailingFragment = buffer.slice(lastIndex).trim();
    // Buffer unfinished JSON (starts with { with no ending }), else emit as markdown
    if (trailingFragment.startsWith('{') && !trailingFragment.endsWith('}')) {
      // Incomplete JSON, save for next call
      return [blocks, trailingFragment];
    }
    if (trailingFragment) {
      blocks.push({ type: 'markdown', content: trailingFragment, raw: trailingFragment });
    }
  }

  // No unparsed buffer left
  return [blocks, ''];
}

