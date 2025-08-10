import React from 'react';

export default function MessageBubble({ message, businessNumber }) {
  const isOutgoing = message.from === businessNumber;
  const container = isOutgoing ? 'justify-end' : 'justify-start';
  const bg = isOutgoing ? 'bg-[#dcf8c6]' : 'bg-white';
  const time = message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '';
  const statusIcon = message.status === 'sent' ? '✓' : message.status === 'delivered' ? '✓✓' : message.status === 'read' ? '✓✓ (read)' : '';

  return (
    <div className={`flex ${container} mb-2`}>
      <div className={`${bg} p-3 rounded-lg max-w-[70%]`}>
        <div className="whitespace-pre-wrap">{message.text}</div>
        <div className="text-xs text-gray-500 mt-2 flex justify-end items-center gap-2">
          <span>{time}</span>
          {isOutgoing && <span className="ml-1">{statusIcon}</span>}
        </div>
      </div>
    </div>
  );
}

