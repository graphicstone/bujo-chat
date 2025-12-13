/**
 * ComponentRenderer
 * Dynamically renders UI components based on parsed response data
 */

import ButtonGroup from './ui-library/ButtonGroup';
import ChatExamples from './ui-library/ChatExamples';
import Form from './ui-library/Form';
import List from './ui-library/List';

const ComponentRenderer = ({ jsonBlock }) => {
  if (!jsonBlock || !jsonBlock.type) return null;

  switch (jsonBlock.type) {
    case 'button-group':
      // Render a ButtonGroup given array of variants from new JSON format
      return <ButtonGroup buttons={(jsonBlock.variants || []).map((variant) => ({ variant, text: variant.charAt(0).toUpperCase() + variant.slice(1) }))} />;
    case 'chat-examples':
      // Render example chat bubbles using array of bubble objects
      return <ChatExamples bubbles={jsonBlock.bubbles || []} />;
    case 'form':
      // Render form with input fields and submit button
      return <Form fields={jsonBlock.fields || []} submitText={jsonBlock.submitText || 'Submit'} />;
    case 'list':
      // Render ordered or unordered list
      return <List items={jsonBlock.items || []} ordered={jsonBlock.ordered || false} style={jsonBlock.style || 'default'} />;
    default:
      return null;
  }
};

export default ComponentRenderer;

