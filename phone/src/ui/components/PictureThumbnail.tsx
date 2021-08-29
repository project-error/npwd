import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';

interface IStyleProps {
  size: string;
}

interface PictureThumbnailProps {
  src: string;
  alt: string;
  size?: string;
}

const useStyles = makeStyles<Theme, IStyleProps>({
  root: ({ size }) => ({
    objectFit: 'contain',
    width: size,
  }),
});

export const PictureThumbnail: React.FC<PictureThumbnailProps> = ({ src, alt, size = '3em' }) => (
  <img className={useStyles({ size }).root} src={src} alt={alt} />
);
