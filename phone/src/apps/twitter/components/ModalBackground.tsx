import { memo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useModal } from '../hooks/useModal';

const useStyles = makeStyles(() => ({
  backgroundModal: {
    background: 'black',
    opacity: '0.6',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
}));

const ModalBackground = () => {
  const classes = useStyles();
  const { modalVisible } = useModal();

  return <div className={modalVisible ? classes.backgroundModal : undefined} />;
};

export default memo(ModalBackground);
