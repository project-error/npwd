import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';

interface IStyleProps {
  size: string;
}

interface IProps {
  src: string,
  alt: string,
  size?: string
}

const useStyles = makeStyles<Theme, IStyleProps>({
  root: ({ size }) => ({
    objectFit: 'contain',
    width: size,
  }),
});

export const PictureThumbnail = ({ src, alt, size = '3em' }: IProps) => {
  return <img className={useStyles({ size }).root} src={src} alt={alt} />;
};
