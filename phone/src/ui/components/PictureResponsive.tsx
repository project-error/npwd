import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

interface PictureResponsiveProps {
  src: string;
  alt: string;
  popper?: boolean;
}

const useStyles = makeStyles({
  root: {
    width: '100%',
    objectFit: 'contain',
  },
  rootPopper: {
    width: '100%',
    objectFit: 'contain',
    transform: 'scale(1.2)',
  },
});

export const PictureResponsive: React.FC<PictureResponsiveProps> = ({
  src,
  alt,
  popper = false,
}) => <img className={popper ? useStyles().rootPopper : useStyles().root} src={src} alt={alt} />;
