import React from 'react';

export default function StatusIcon({ status }) {
  switch (status) {
    case 'sent': return <span>✓</span>; // single check
    case 'delivered': return <span>✓✓</span>; // double check
    case 'read': return <span style={{ color: 'blue' }}>✓✓</span>; // blue double check
    default: return null;
  }
}
