import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import types from "../types";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "2px 15px",
  },
}));

import MediaImage from "./MediaImage";

export const Media = ({ id, mediaType, mediaLink, handleClose }) => {
  switch (mediaType) {
    case types.IMAGE:
    case types.GIF:
      return <MediaImage mediaLink={mediaLink} handleClick={handleClose} />;
    default:
      return null;
  }
};

export const MediaDisplay = ({ visible, media, removeMedia }) => {
  const classes = useStyles();
  if (!visible || media.length === 0) return null;

  return (
    <div className={classes.root}>
      {media.map((mediaItem) => (
        <Media
          id={mediaItem.id}
          handleClose={() => removeMedia(mediaItem.id)}
          {...mediaItem}
        />
      ))}
    </div>
  );
};

export default MediaDisplay;
