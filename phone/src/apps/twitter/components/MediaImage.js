import React from "react";
import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "2px 15px",
  },
  mediaImage: {
    // catch the close button here so it doesn't go all the way up to the modal
    position: "relative",
    display: "inline-block",
  },
  imgButton: {
    position: "absolute", // show the close button in the top right of the image
    top: "2px",
    right: "5px",
    backgroundColor: "#000",
    opacity: 0.7,
    "&:hover": {
      // fixes a bug where when the user closes one image material-ui puts
      // the hover status on the previous image
      backgroundColor: "#000",
    },
  },
  img: {
    maxHeight: "125px", // constrain images so we don't overwhelm the UI
    maxWidth: "300px",
    padding: "0px 3px 3px 0px",
  },
}));

export const MediaImage = ({ mediaLink, handleClick }) => {
  const classes = useStyles();
  return (
    <div className={classes.mediaImage}>
      <IconButton
        className={classes.imgButton}
        onClick={handleClick}
        size="small"
      >
        <CloseIcon />
      </IconButton>
      <img className={classes.img} src={mediaLink} />
    </div>
  );
};

export default MediaImage;
