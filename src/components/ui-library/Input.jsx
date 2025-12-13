/**
 * Input Component
 * Text input field with various styles and states
 */

const Input = ({ placeholder = 'Enter text...', type = 'text', disabled = false, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
    />
  );
};

export default Input;

