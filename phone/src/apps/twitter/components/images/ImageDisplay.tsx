import React from 'react';

import Image from './Image';

export const ImageDisplay = ({ visible, images, removeImage, small }) => {
  if (!visible || !images || images.length === 0) return null;

  const styles = { margin: small ? '2px 0px' : '2px 15px' };

  return (
    <div style={styles}>
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
