import React from 'react';
import { Box, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PictureReveal } from '@ui/components/PictureReveal';
import { PictureResponsive } from '@ui/components/PictureResponsive';

const ImageContainer = styled(Box)({
  position: 'relative',
  display: 'inline-block',
});

const ImageButton = styled(IconButton)({
  position: 'absolute', // show the close button in the top right of the image
  top: '2px',
  right: '5px',
  backgroundColor: '#000',
  opacity: 0.7,
  '&:hover': {
    // fixes a bug where when the user closes one image material-ui puts
    // the hover status on the previous image
    backgroundColor: '#000',
  },
});

export const Image = ({ link, handleClick }) => {
  return (
    <ImageContainer>
      {handleClick && (
        <ImageButton onClick={handleClick} size="small">
          <CloseIcon />
        </ImageButton>
      )}
      <PictureReveal>
        <PictureResponsive alt="small avatar" src={link} />
      </PictureReveal>
    </ImageContainer>
  );
};

export default Image;
