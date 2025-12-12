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

