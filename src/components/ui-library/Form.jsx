/**
 * Form Component
 * Example form with input fields and submit button
 */

import { useState } from 'react';
import Input from './Input';
import Button from './Button';
import { useToast } from '../../hooks/useToast';

const Form = ({ fields = [], submitText = 'Submit' }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({});

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast(`Form submitted with: ${JSON.stringify(formData)}`, 'success');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
      {fields.map((field, index) => (
        <div key={index}>
          {field.label && (
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
          )}
          <Input
            placeholder={field.placeholder || field.label || 'Enter value...'}
            type={field.type || 'text'}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          />
        </div>
      ))}
      <Button
        variant="primary"
        text={submitText}
        type="submit"
      />
    </form>
  );
};

export default Form;

