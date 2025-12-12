/**
 * ButtonGroup Component
 * Container for displaying multiple button variants
 */

import { useToast } from '../../hooks/useToast';
import Button from './Button';

const ButtonGroup = ({ buttons = [] }) => {
  const { showToast } = useToast();

  const handleButtonClick = (variant, text) => {
    const variantName = variant.charAt(0).toUpperCase() + variant.slice(1);
    showToast(`Clicked: ${variantName} Button - "${text}"`, 'info');
  };

  return (
    <div className="flex flex-wrap gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant={button.variant}
          text={button.text}
          onClick={() => handleButtonClick(button.variant, button.text)}
        />
      ))}
    </div>
  );
};

export default ButtonGroup;

