import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import types from "../types";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "2px 15px",
  },
  img: {
    maxHeight: "125px",
  },
}));

export const Media = ({ mediaType, mediaLink }) => {
  const classes = useStyles();
  switch (mediaType) {
    case types.IMAGE:
    case types.GIF:
      return <img className={classes.img} src={mediaLink} />;
    default:
      return null;
  }
};

export const MediaDisplay = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Media {...props} />
    </div>
  );
};

export default MediaDisplay;
