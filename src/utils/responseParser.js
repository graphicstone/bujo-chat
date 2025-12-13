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

/**
 * Find balanced JSON blocks by counting braces
 * @param {string} text - Text to search
 * @returns {Array} Array of {start, end, content} for each JSON block
 */
function findJsonBlocks(text) {
  const blocks = [];
  let i = 0;
  
  while (i < text.length) {
    // Find opening brace
    if (text[i] === '{') {
      let braceCount = 0;
      let start = i;
      let inString = false;
      let escapeNext = false;
      
      // Count braces to find matching closing brace
      for (let j = i; j < text.length; j++) {
        const char = text[j];
        
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        
        if (char === '"') {
          inString = !inString;
          continue;
        }
        
        if (!inString) {
          if (char === '{') {
            braceCount++;
          } else if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
              // Found complete JSON block
              const content = text.slice(start, j + 1);
              blocks.push({ start, end: j + 1, content });
              i = j + 1;
              break;
            }
          }
        }
      }
      
      // If we didn't find a closing brace, this might be incomplete JSON
      if (braceCount > 0) {
        // Return incomplete block info for buffering
        return { blocks, incompleteStart: start };
      }
    }
    i++;
  }
  
  return { blocks, incompleteStart: -1 };
}

export function parseStreamedAssistantResponse(incomingText, previousBuffer = '') {
  // Buffer the incoming text
  let buffer = previousBuffer + incomingText;
  const blocks = [];

  // Find all JSON blocks using balanced brace matching
  const { blocks: jsonBlocks, incompleteStart } = findJsonBlocks(buffer);

  let lastIndex = 0;

  // Process each JSON block
  for (const jsonMatch of jsonBlocks) {
    // Markdown between previous index and this JSON
    if (jsonMatch.start > lastIndex) {
      const markdownFragment = buffer.slice(lastIndex, jsonMatch.start).trim();
      if (markdownFragment) {
        blocks.push({ type: 'markdown', content: markdownFragment, raw: markdownFragment });
      }
    }

    // Try to parse the JSON block
    const jsonFragment = jsonMatch.content;
    try {
      const parsed = JSON.parse(jsonFragment);
      // Only treat as JSON component if it's an object with a 'type' field
      if (typeof parsed === 'object' && parsed !== null && parsed.type) {
        blocks.push({ type: 'json', content: parsed, raw: jsonFragment });
      } else {
        // Valid JSON but not a component definition, treat as markdown
        blocks.push({ type: 'markdown', content: jsonFragment, raw: jsonFragment });
      }
    } catch {
      // Invalid JSON, emit as markdown
      blocks.push({ type: 'markdown', content: jsonFragment, raw: jsonFragment });
    }

    lastIndex = jsonMatch.end;
  }

  // Handle incomplete JSON (if we found an opening brace but no closing)
  if (incompleteStart >= 0) {
    const trailingFragment = buffer.slice(incompleteStart).trim();
    // Check if there's markdown before the incomplete JSON
    if (incompleteStart > lastIndex) {
      const markdownFragment = buffer.slice(lastIndex, incompleteStart).trim();
      if (markdownFragment) {
        blocks.push({ type: 'markdown', content: markdownFragment, raw: markdownFragment });
      }
    }
    // Return incomplete JSON in buffer for next chunk
    return [blocks, trailingFragment];
  }

  // Any trailing markdown
  if (lastIndex < buffer.length) {
    const trailingFragment = buffer.slice(lastIndex).trim();
    if (trailingFragment) {
      blocks.push({ type: 'markdown', content: trailingFragment, raw: trailingFragment });
    }
  }

  // No unparsed buffer left
  return [blocks, ''];
}

