import React from 'react';
import { makeStyles } from '@material-ui/core';

interface PictureResponsiveProps {
  src: string;
  alt: string;
}

const useStyles = makeStyles({
  root: {
    width: '100%',
    objectFit: 'contain',
  },
});

export const PictureResponsive: React.FC<PictureResponsiveProps> = ({ src, alt }) => (
  <img className={useStyles().root} src={src} alt={alt} />
);
