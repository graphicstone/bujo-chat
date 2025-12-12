/**
 * Button Component
 * Various button variants for the UI library
 */

const Button = ({ variant = 'primary', text, onClick, ...props }) => {
  const baseStyles = "px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer active:scale-95";
  
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500 border border-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    outline: "bg-transparent text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-500 border-2 border-blue-600"
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary}`}
      onClick={onClick}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;

