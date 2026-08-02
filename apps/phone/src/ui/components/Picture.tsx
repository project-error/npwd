import React, { useState } from 'react';
import { NPWDButton } from '@npwd/keyos';
import { PictureThumbnail } from './PictureThumbnail';
import { PictureResponsive } from './PictureResponsive';
import Modal from './Modal';

interface PictureProps {
  src: string;
  alt: string;
  size?: string;
}

export const Picture: React.FC<PictureProps> = ({ src, alt, size }) => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <>
      <NPWDButton onClick={() => setVisible(true)} size="icon" variant="ghost">
        <PictureThumbnail size={size} src={src} alt={alt} />
      </NPWDButton>
      <Modal visible={visible} handleClose={() => setVisible(false)}>
        <PictureResponsive src={src} alt={alt} />
      </Modal>
    </>
  );
};
