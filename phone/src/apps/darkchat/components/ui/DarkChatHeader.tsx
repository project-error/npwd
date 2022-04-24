import React from 'react';
import { Box, IconButton, Paper, Typography, Button } from '@mui/material';
import { useApp } from '@os/apps/hooks/useApps';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled from '@emotion/styled';
import { useHistory } from 'react-router-dom';
import { useActiveDarkchatValue } from '../../state/state';

interface HeaderProps {
  background: string;
}

const Header = styled(Paper)<HeaderProps>(({ theme, background }) => ({
  backgroundColor: background || theme.palette.background.default,
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: 0,
}));

const LeaveButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const DarkChatHeader: React.FC = () => {
  const { backgroundColor } = useApp('DARKCHAT');
  const activeConversation = useActiveDarkchatValue();
  const [t] = useTranslation();

  const { goBack } = useHistory();

  return (
    <Header background={backgroundColor}>
      <Box display="flex" alignItems="center" flexDirection="row" gap={1}>
        <IconButton onClick={goBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography fontSize={26}>{activeConversation.label}</Typography>
        </Box>
      </Box>
      <Box pr={2}>
        <LeaveButton>Leave</LeaveButton>
      </Box>
    </Header>
  );
};

export default DarkChatHeader;
