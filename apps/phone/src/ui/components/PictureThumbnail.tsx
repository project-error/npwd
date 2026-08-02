import React from 'react';

interface PictureThumbnailProps {
  src: string;
  alt: string;
  size?: string;
}

export const PictureThumbnail: React.FC<PictureThumbnailProps> = ({
  src,
  alt,
  size = '3em',
}) => (
  <img
    alt={alt}
    className="object-contain"
    src={src}
    style={{ width: size }}
  />
);
