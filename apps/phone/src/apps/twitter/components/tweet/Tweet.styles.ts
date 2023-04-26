import { Box, ListItem, styled, Typography } from '@mui/material';

export const TweetItem = styled(ListItem)({
  overflowX: 'hidden',
  display: 'flex',
  flexFlow: 'column nowrap',
  width: '100%',
  marginTop: '6px',
});

export const TweetItemContainer = styled(Box)({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'flex-start',
  width: '100%',
});

export const TweetContent = styled(Box)({
  display: 'flex',
  marginTop: '-10px',
  flexFlow: 'column nowrap',
  width: '100%',
});

export const TweetContentPrimary = styled(Box)({
  display: 'flex',
  flexFlow: 'row nowrap',
  width: '100%',
  alignItems: 'flex-end',
});

export const TweetProfile = styled(Box)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 'bold',
  color: theme.palette.text.primary
}));

export const TweetDate = styled(Typography)({
  marginLeft: '10px',
  fontSize: '14px',
});

export const TweetMessage = styled(Box)(({ theme }) => ({
  fontSize: '18px',
  wordBreak: 'break-all',
  color: theme.palette.text.secondary
}));

export const TweetButtonContainer = styled(Box)({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  width: '100%',
  marginLeft: '-20px',
  marginTop: '3px',
});
