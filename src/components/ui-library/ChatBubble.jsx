/**
 * ChatBubble Component
 * Different chat bubble styles for messages
 */

const ChatBubble = ({ type = 'user', message }) => {
  const baseStyles = "px-4 py-2 rounded-lg max-w-xs break-words outline-none focus:outline-none cursor-default select-none";
  
  const typeStyles = {
    user: "bg-blue-600 text-white ml-auto rounded-br-none",
    assistant: "bg-gray-200 text-gray-800 mr-auto rounded-bl-none",
    system: "bg-yellow-100 text-yellow-800 mx-auto rounded-t-lg border border-yellow-300"
  };
  
  return (
    <div 
      className={`${baseStyles} ${typeStyles[type] || typeStyles.user} w-fit`}
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault()}
    >
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default ChatBubble;

