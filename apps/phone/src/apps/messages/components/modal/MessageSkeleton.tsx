import React from 'react';

export default function MessageSkeleton({ height, isMine = false }) {
  const marginLeft = isMine ? '60px' : '8px';
  return (
    <div className="mb-3 animate-pulse" style={{ marginLeft, height: `${height}px` }}>
      <div
        className="rounded-[20px] bg-white/10"
        style={{ width: 325, height }}
      />
    </div>
  );
}
