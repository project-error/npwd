import React from 'react';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { PictureReveal } from '../../../../ui/components/PictureReveal';
import { PictureResponsive } from '../../../../ui/components/PictureResponsive';

const useStyles = makeStyles(() => ({
  root: {
    margin: '2px 15px',
  },
  imageContainer: {
    // catch the close button here so it doesn't go all the way up to the modal
    position: 'relative',
    display: 'inline-block',
  },
  imgButton: {
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
  },
}));

export const Image = ({ link, handleClick }) => {
  const classes = useStyles();
  return (
    <div className={classes.imageContainer}>
      {handleClick && (
        <IconButton className={classes.imgButton} onClick={handleClick} size="small">
          <CloseIcon />
        </IconButton>
      )}
      <PictureReveal>
        <PictureResponsive alt="small avatar" src={link} />
      </PictureReveal>
    </div>
  );
};

export default Image;
