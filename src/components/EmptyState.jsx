import React from 'react';
import { MessageSquare, Box, Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Kosong', description = '', actionLabel, onAction, icon = 'message' }) {
  const Icon = (iconName) => {
    switch(iconName) {
      case 'message': return MessageSquare;
      case 'box': return Box;
      case 'inbox': return Inbox;
      default: return MessageSquare;
    }
  };

  const Comp = Icon(icon);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-6 max-w-lg">
        <div className="mx-auto w-28 h-28 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-6 shadow">
          <Comp className="w-12 h-12 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        {description && <p className="text-gray-600 mb-4">{description}</p>}
        {actionLabel && (
          <button onClick={onAction} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded shadow">
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
