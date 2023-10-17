import React, { useState } from 'react';

import { usePhone } from '@os/phone/hooks/usePhone';
import { IMG_DEFAULT_AVATAR, IMG_INVALID_AVATAR } from '../utils/constants';
import { Box, styled } from '@mui/material';

const AvatarWrapper = styled(Box)({
  width: '100%',
});

const Image = styled('img')({
  borderRadius: '50%',
  objectFit: 'cover',
});

function Avatar({ avatarUrl, showInvalidImage, height, width }) {
  const [showImageError, setShowImageError] = useState(false);
  const { ResourceConfig } = usePhone();

  const handleImageError = () => setShowImageError(true);
  const handleImageLoad = () => setShowImageError(false);

  if (!ResourceConfig || !ResourceConfig.twitter.enableAvatars) return null;

  return (
    <AvatarWrapper>
      {showImageError && (
        <Image
          src={showInvalidImage ? IMG_INVALID_AVATAR : IMG_DEFAULT_AVATAR}
          alt="Invalid avatar"
          style={{ height, width }}
        />
      )}
      <Image
        src={avatarUrl || IMG_DEFAULT_AVATAR}
        alt="Your profile avatar"
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: showImageError ? 'none' : 'block', height, width }}
      />
    </AvatarWrapper>
  );
}

Avatar.defaultProps = {
  avatarUrl: null,
  showInvalidImage: false,
  height: '125px',
  width: '125px',
};

export default Avatar;
