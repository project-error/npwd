import React from 'react';
import { Theme } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

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
