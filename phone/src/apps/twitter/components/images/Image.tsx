import React from 'react';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

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
  img: {
    maxHeight: '125px', // constrain images so we don't overwhelm the UI
    maxWidth: '300px',
    padding: '0px 3px 3px 0px',
  },
  imgSmall: {
    maxHeight: '200px', // constrain images so we don't overwhelm the UI
    maxWidth: '100%',
    padding: '0px 1px 1px 0px',
  },
}));

export const Image = ({ link, handleClick, small }) => {
  const classes = useStyles();
  return (
    <div className={classes.imageContainer}>
      {handleClick && (
        <IconButton className={classes.imgButton} onClick={handleClick} size="small">
          <CloseIcon />
        </IconButton>
      )}
      <img
        alt="small avatar"
        className={small ? classes.imgSmall : classes.img}
        src={link}
      />
    </div>
  );
};

export default Image;
