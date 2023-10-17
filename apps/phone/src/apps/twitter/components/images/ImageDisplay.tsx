import { Box } from '@mui/material';
import { Image as ImageType } from '@typings/twitter';
import React from 'react';
import Image from './Image';

interface ImageDisplayProps {
  visible: boolean;
  images: ImageType[];
  removeImage?: (id: string) => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ visible, images, removeImage }) => {
  if (!visible || !images || images.length === 0) return null;

  return (
    <Box p={1}>
      {images.map((image) => (
        <Image
          key={image.id}
          link={image.link}
          handleClick={removeImage ? () => removeImage(image.id) : null}
        />
      ))}
    </Box>
  );
};

ImageDisplay.defaultProps = {
  removeImage: null,
};

export default ImageDisplay;
