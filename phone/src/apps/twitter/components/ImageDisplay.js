import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Image from "./Image";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "2px 15px",
  },
}));

export const ImageDisplay = ({ visible, images, removeImage, small }) => {
  const classes = useStyles();
  if (!visible || !images || images.length === 0) return null;

  return (
    <div className={classes.root}>
      {images.map((link) => (
        <Image
          key={link}
          link={link}
          handleClick={removeImage ? () => removeImage(link) : null}
          small={small}
        />
      ))}
    </div>
  );
};

ImageDisplay.defaultProps = {
  removeImage: null,
  small: false,
};

export default ImageDisplay;
