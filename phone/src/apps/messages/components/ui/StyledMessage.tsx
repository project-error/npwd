import { styled } from '@mui/styles';
import { Box } from '@mui/material';

const StyledMessage = styled(Box)({
  wordBreak: 'break-word',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  whiteSpace: 'pre-line',
});

export default StyledMessage;
