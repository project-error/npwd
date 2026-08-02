import React, { useState } from 'react';

import { usePhone } from '@os/phone/hooks/usePhone';
import { IMG_DEFAULT_AVATAR, IMG_INVALID_AVATAR } from '../utils/constants';
import { cn } from '@utils/css';

function Avatar({ avatarUrl, showInvalidImage, height, width }) {
  const [showImageError, setShowImageError] = useState(false);
  const { ResourceConfig } = usePhone();

  const handleImageError = () => setShowImageError(true);
  const handleImageLoad = () => setShowImageError(false);

  if (!ResourceConfig || !ResourceConfig.twitter.enableAvatars) return null;

  return (
    <div className="w-full">
      {showImageError && (
        <img
          src={showInvalidImage ? IMG_INVALID_AVATAR : IMG_DEFAULT_AVATAR}
          alt="Invalid avatar"
          style={{ height, width }}
          className="rounded-full object-cover"
        />
      )}
      <img
        src={avatarUrl || IMG_DEFAULT_AVATAR}
        alt="Your profile avatar"
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: showImageError ? 'none' : 'block', height, width }}
        className={cn('rounded-full object-cover')}
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
