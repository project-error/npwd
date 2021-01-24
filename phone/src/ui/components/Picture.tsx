import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { PictureThumbnail } from './PictureThumbnail';
import { PictureResponsive } from './PictureResponsive';
import Modal from './Modal';

interface IProps {
  src: string;
  alt: string;
  size?: string;
}

export const Picture = ({ src, alt, size }: IProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <>
      <Button onClick={() => setVisible(true)}>
        <PictureThumbnail size={size} src={src} alt={alt} />
      </Button>
      <Modal visible={visible} handleClose={() => setVisible(false)}>
        <PictureResponsive src={src} alt={alt} />
      </Modal>
    </>
  );
};
