import { Box } from '@material-ui/core';
import React from 'react';

import Image from './Image';

export const ImageDisplay = ({ visible, images, removeImage, small }) => {
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
  small: false,
};

export default ImageDisplay;
