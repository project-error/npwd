import { Box, Popper } from '@mui/material';
import { Image as ImageType } from '@typings/twitter';
import { PictureResponsive } from '@ui/components';
import makeStyles from '@mui/styles/makeStyles';
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

const useStyles = makeStyles({
  root: {
    position: 'fixed!important' as 'fixed',
    top: '50%!important',
    left: '50%!important',
    transform: 'translate(-50%, -50%)!important'
  },
});

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

  const styles = useStyles();

  return (
    <Box p={1}>
      {images.map((image) => (
        <Box onClick={(e) => handleOpenImage(e, image.id)}>
          <Image
            key={image.id}
            link={image.link}
            handleClick={removeImage ? () => removeImage(image.id) : null}
          />
          <Popper anchorEl={anchorEl} placement="left" open={open === image.id} className={styles.root}>
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
