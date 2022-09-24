import { Box, Popper } from '@mui/material';
import { PictureResponsive } from '@ui/components';
import Backdrop from '@ui/components/Backdrop';
import React, { useState } from 'react';

import Image from './Image';

export const ImageDisplay = ({ visible, images, removeImage }) => {
  if (!visible || !images || images.length === 0) return null;
  const [imageOpen, setImageOpen] = useState(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenImage = (e, id: number) => {
    setAnchorEl(e.currentTarget);
    setImageOpen(id);
  };

  const closeImage = () => {
    setImageOpen(null);
    setAnchorEl(null);
  };

  return (
    <Box p={1}>
      {imageOpen && <Backdrop onClick={closeImage} />}
      {images.map((image) => (
        <Box onClick={(e) => handleOpenImage(e, image.id)}>
          <Image
            key={image.id}
            link={image.link}
            handleClick={removeImage ? () => removeImage(image.id) : null}
          />
          <Popper anchorEl={anchorEl} placement="left" open={imageOpen === image.id}>
            <PictureResponsive popper alt="image" src={image.link} />
          </Popper>
        </Box>
      ))}
    </Box>
  );
};

ImageDisplay.defaultProps = {
  removeImage: null,
  small: false,
};

export default ImageDisplay;
