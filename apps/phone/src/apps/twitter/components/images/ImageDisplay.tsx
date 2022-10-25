import { Box, Popper } from '@mui/material';
import { Image as ImageType } from '@typings/twitter';
import { PictureResponsive } from '@ui/components';
import React, { useState } from 'react';
import Image from './Image';

interface ImageDisplayProps {
  visible: boolean;
  images: ImageType[];
  removeImage?: (id: string) => void;
  small?: boolean;
  open: string;
  onToggle: (value: string | null) => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  visible,
  images,
  small,
  removeImage,
  open,
  onToggle,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!visible || !images || images.length === 0) return null;

  const handleOpenImage = (e, id: string) => {
    setAnchorEl(e.currentTarget);
    onToggle(id);
  };

  return (
    <Box p={1}>
      {images.map((image) => (
        <Box onClick={(e) => handleOpenImage(e, image.id)}>
          <Image
            key={image.id}
            link={image.link}
            handleClick={removeImage ? () => removeImage(image.id) : null}
          />
          <Popper anchorEl={anchorEl} placement="left" open={open === image.id}>
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
