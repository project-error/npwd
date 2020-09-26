import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { IMG_DEFAULT_AVATAR, IMG_INVALID_AVATAR } from "../utils/constants";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  imgContainer: {},
  button: {
    background: "none",
    border: "none",
  },
  img: {
    height: "125px",
    width: "125px",
    borderRadius: "50%",
    objectFit: "cover",
  },
});

function Avatar({ avatarUrl, showInvalidImage }) {
  const classes = useStyles();
  const [showImageError, setShowImageError] = useState(false);

  const handleImageError = () => setShowImageError(true);
  const handleImageLoad = () => setShowImageError(false);

  return (
    <div className={classes.root}>
      <div className={classes.imgContainer}>
        {showImageError && (
          <img
            className={classes.img}
            src={showInvalidImage ? IMG_INVALID_AVATAR : IMG_DEFAULT_AVATAR}
            alt="Invalid avatar image"
          />
        )}
        <img
          className={classes.img}
          src={avatarUrl || IMG_DEFAULT_AVATAR}
          alt="Your profile avatar"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ display: showImageError ? "none" : "block" }}
        />
      </div>
    </div>
  );
}

Avatar.defaultProps = {
  avatarUrl: null,
  showInvalidImage: false,
};

export default Avatar;
