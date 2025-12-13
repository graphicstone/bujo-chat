/**
 * List Component
 * Ordered or unordered list with customizable items
 */

const List = ({ items = [], ordered = false, style = 'default' }) => {
  const ListTag = ordered ? 'ol' : 'ul';
  const listStyles = {
    default: ordered ? 'list-decimal' : 'list-disc',
    none: 'list-none',
    square: 'list-square',
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <ListTag className={`${listStyles[style] || listStyles.default} space-y-2 ml-4`}>
        {items.map((item, index) => (
          <li key={index} className="text-sm text-gray-700">
            {typeof item === 'string' ? item : item.text || item}
          </li>
        ))}
      </ListTag>
    </div>
  );
};

export default List;

