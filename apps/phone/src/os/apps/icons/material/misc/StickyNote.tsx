
import React from 'react';

type IconComponentProps = {
  className?: string;
  style?: React.CSSProperties;
};

const StickyNote: React.FC<IconComponentProps> = (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props} className={props.className} style={props.style}>
      <rect fill="none" />
      <path d="M19,3H4.99C3.89,3,3,3.9,3,5l0.01,14c0,1.1,0.89,2,1.99,2h10l6-6V5C21,3.9,20.1,3,19,3z M7,8h10v2H7V8z M12,14H7v-2h5V14z M14,19.5V14h5.5L14,19.5z" />
    </svg>
);

export default StickyNote;
