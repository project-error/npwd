import React from 'react';
import { ChannelMessageProps } from '@typings/darkchat';
import { Box, Typography, Paper, lighten } from '@mui/material';
import styled from '@emotion/styled';
import dayjs from 'dayjs';

interface MessageType {
  isMine: boolean;
}

const StyledMessageContainer = styled(Paper)<MessageType>(({ theme, isMine }) => ({
  color: '#fff',
  float: isMine ? 'right' : 'left',
  margin: theme.spacing(1),
  padding: '6px 16px',
  height: 'auto',
  width: 'auto',
  minWidth: '50%',
  maxWidth: '80%',
  textOverflow: 'ellipsis',
  backgroundColor: isMine ? lighten(theme.palette.primary.dark, 0.1) : theme.palette.primary.dark,
}));

const StyledMessage = styled(Box)({
  wordBreak: 'break-word',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ChannelMessageBubble: React.FC<ChannelMessageProps> = (item) => {
  return (
    <Box
      display="flex"
      ml={1}
      alignItems="stretch"
      justifyContent={item.isMine ? 'flex-end' : 'flex-start'}
      mt={1}
    >
      <StyledMessageContainer isMine={item.isMine}>
        <StyledMessage>
          <Typography fontSize={16}>{item.message}</Typography>
        </StyledMessage>
        <Typography color="#ccc" fontWeight={500} mt={1}>
          {dayjs.unix(item.createdAt).fromNow()}
        </Typography>
      </StyledMessageContainer>
    </Box>
  );
};

export default ChannelMessageBubble;
