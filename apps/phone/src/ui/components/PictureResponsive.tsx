import React from 'react';
import { cn } from '@utils/css';

interface PictureResponsiveProps {
  src: string;
  alt: string;
  popper?: boolean;
}

export const PictureResponsive: React.FC<PictureResponsiveProps> = ({
  src,
  alt,
  popper = false,
}) => {
  return (
    <img
      alt={alt}
      className={cn('w-full object-contain', popper && 'max-h-[80vh] h-auto')}
      src={src}
    />
  );
};
