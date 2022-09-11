import { styled } from '@mui/styles';
import { Box } from '@mui/material';

const StyledMessage = styled(Box)({
  wordBreak: 'break-word',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  whiteSpace: 'pre-line',
});

export const AudioMessage = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'column',
});

export default StyledMessage;
