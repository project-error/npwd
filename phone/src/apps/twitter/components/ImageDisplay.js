import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Image from "./Image";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "2px 0px",
  },
}));

export const ImageDisplay = ({ visible, images, removeImage, small }) => {
  const classes = useStyles();
  if (!visible || !images || images.length === 0) return null;

  const styles = { margin: small ? "2px 0px" : "2px 15px" };

  return (
    <div className={classes.root} style={styles}>
      {images.map((image) => (
        <Image
          key={image.id}
          link={image.link}
          handleClick={removeImage ? () => removeImage(image.id) : null}
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
