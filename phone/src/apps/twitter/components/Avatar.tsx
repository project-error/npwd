import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { usePhone } from '../../../os/phone/hooks/usePhone';
import { IMG_DEFAULT_AVATAR, IMG_INVALID_AVATAR } from '../utils/constants';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  img: {
    borderRadius: '50%',
    objectFit: 'cover',
  },
});

function Avatar({ avatarUrl, showInvalidImage, height, width }) {
  const classes = useStyles();
  const [showImageError, setShowImageError] = useState(false);
  const { ResourceConfig } = usePhone();

  const handleImageError = () => setShowImageError(true);
  const handleImageLoad = () => setShowImageError(false);

  if (!ResourceConfig || !ResourceConfig.twitter.enableAvatars) return null;

  return (
    <div className={classes.root}>
      {showImageError && (
        <img
          className={classes.img}
          src={showInvalidImage ? IMG_INVALID_AVATAR : IMG_DEFAULT_AVATAR}
          alt="Invalid avatar"
          style={{ height, width }}
        />
      )}
      <img
        className={classes.img}
        src={avatarUrl || IMG_DEFAULT_AVATAR}
        alt="Your profile avatar"
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: showImageError ? 'none' : 'block', height, width }}
      />
    </div>
  );
}

Avatar.defaultProps = {
  avatarUrl: null,
  showInvalidImage: false,
  height: '125px',
  width: '125px',
};

export default Avatar;
