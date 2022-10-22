import { styled } from '@mui/styles';

const Backdrop = styled('div')({
  background: 'black',
  opacity: '0.6',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 5,
});

export default Backdrop;
