import React from 'react';
import Paper from '@mui/material/Paper';
import TwitterIcon from '@mui/icons-material/Twitter';
import { styled } from '@mui/material';

const TwitterHeader = styled(Paper)({
  height: '50px',
  width: '100%',
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#424242',
});

const Icon = styled(TwitterIcon)({
  color: '#00acee',
  fontSize: 30,
});

export function TwitterTitle() {
  return (
    <TwitterHeader variant="outlined" square>
      <Icon />
    </TwitterHeader>
  );
}

export default TwitterTitle;
