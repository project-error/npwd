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
    maxWidth: '80vh',
    height: 'auto',
    objectFit: 'contain',
  },
});

export const PictureResponsive: React.FC<PictureResponsiveProps> = ({
  src,
  alt,
  popper = false,
}) => {
  const styles = useStyles();
  return <img className={popper ? styles.rootPopper : styles.root} src={src} alt={alt} />;
};
