/**
 * ComponentRenderer
 * Dynamically renders UI components based on parsed response data
 */

import ButtonGroup from './ui-library/ButtonGroup';
import ChatExamples from './ui-library/ChatExamples';

const ComponentRenderer = ({ components = [] }) => {
  if (!components || components.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4">
      {components.map((component, index) => {
        switch (component.type) {
          case 'button-group':
            return (
              <ButtonGroup
                key={index}
                buttons={component.elements}
              />
            );
          
          case 'chat-examples':
            return (
              <ChatExamples
                key={index}
                bubbles={component.elements}
              />
            );
          
          default:
            return null;
        }
      })}
    </div>
  );
};

export default ComponentRenderer;

