import React from 'react';

function StatusDisplay({ className, visible, text }) {
  const style = { opacity: visible ? '0.65' : '0.0' };

  return (
    <div className={className} style={style}>
      {text}
    </div>
  );
}

export default StatusDisplay;
