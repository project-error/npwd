import React, { useEffect, useRef } from 'react';

import { LikeorDislikeDraggableElement } from '../utils/drag';

interface IProps {
  id: string;
  children: React.ReactNode;
  onDrag: (deltaX: number) => void;
  onDrop: () => void;
}

const MAX_ROTATION_DEG = 15;

function Draggable({ id, children, onDrag, onDrop }: IProps) {
  const elementRef = useRef(null);

  useEffect(() => {
    const drag = new LikeorDislikeDraggableElement(elementRef, MAX_ROTATION_DEG, onDrag, onDrop);
    return () => drag.cleanup();
  }, [elementRef]); // eslint-disable-line

  return (
    <div>
      <div ref={elementRef} key={id} id={id} className="absolute h-full w-full">
        {children}
      </div>
    </div>
  );
}

export default Draggable;
