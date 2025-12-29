import COURIERS, { getCourierByCode } from '../data/couriers';

/**
 * Courier Logo Component
 * Display courier logo with fallback
 */
export default function CourierLogo({ 
  code, 
  size = 'md', 
  showName = false,
  className = '' 
}) {
  const courier = getCourierByCode(code);

  if (!courier) return null;

  const sizeClasses = {
    xs: 'h-4',
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={courier.logo}
        alt={courier.name}
        className={`${sizeClasses[size]} w-auto object-contain`}
        onError={(e) => {
          // Fallback to colored badge on error
          const parent = e.target.parentElement;
          e.target.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.className = `${sizeClasses[size]} flex items-center justify-center rounded px-2`;
          fallback.style.backgroundColor = courier.bgColor || '#6B7280';
          fallback.innerHTML = `<span class="text-xs font-bold" style="color: ${courier.textColor || '#FFF'}">${courier.code.toUpperCase()}</span>`;
          parent.insertBefore(fallback, e.target);
        }}
      />
      {showName && (
        <span className="font-medium text-gray-700">
          {courier.name}
        </span>
      )}
    </div>
  );
}

/**
 * Courier Badge Component
 * Display courier as a badge with logo
 */
export function CourierBadge({ code, className = '' }) {
  const courier = getCourierByCode(code);

  if (!courier) return null;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 rounded-lg ${className}`}
         style={{ borderColor: (courier.bgColor || courier.color) + '30' }}>
      <img
        src={courier.logo}
        alt={courier.name}
        className="h-5 w-auto object-contain"
        onError={(e) => {
          const parent = e.target.parentElement;
          e.target.style.display = 'none';
          const fallback = document.createElement('span');
          fallback.className = 'text-xs font-bold px-1';
          fallback.style.color = courier.bgColor || courier.color || '#6B7280';
          fallback.textContent = courier.code.toUpperCase();
          parent.insertBefore(fallback, e.target);
        }}
      />
      <span className="text-sm font-semibold" style={{ color: courier.bgColor || courier.color }}>
        {courier.name}
      </span>
    </div>
  );
}

/**
 * Courier Selector Component
 * Grid of courier options
 */
export function CourierSelector({ 
  selected, 
  onSelect, 
  className = '' 
}) {
  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      {COURIERS.map((courier) => (
        <button
          key={courier.code}
          type="button"
          onClick={() => onSelect(courier.code)}
          className={`p-3 border-2 rounded-lg transition-all hover:shadow-md ${
            selected === courier.code
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <img
              src={courier.logo}
              alt={courier.name}
              className="h-8 w-auto object-contain"
              onError={(e) => {
                const parent = e.target.parentElement;
                e.target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'h-8 px-2 flex items-center justify-center rounded';
                fallback.style.backgroundColor = courier.bgColor || '#6B7280';
                fallback.innerHTML = `<span class="text-xs font-bold" style="color: ${courier.textColor || '#FFF'}">${courier.code.toUpperCase()}</span>`;
                parent.insertBefore(fallback, e.target);
              }}
            />
            <span className="text-xs font-medium text-gray-700 text-center">
              {courier.name}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
