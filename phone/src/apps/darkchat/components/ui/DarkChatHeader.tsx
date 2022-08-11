import React, { useState } from 'react';
import { Box, IconButton, Paper, Typography, Button } from '@mui/material';
import { useApp } from '@os/apps/hooks/useApps';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import styled from '@emotion/styled';
import { useHistory } from 'react-router-dom';
import { useActiveDarkchatValue } from '../../state/state';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { TextField } from '@ui/components/Input';
import { useModal } from '@apps/darkchat/hooks/useModal';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

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
  const { setOwnerModal } = useModal();
  const { leaveChannel, updateChannelLabel } = useDarkchatAPI();
  const { goBack } = useHistory();
  const myPhoneNumber = useMyPhoneNumber();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [label, setLabel] = useState<string>(activeConversation.label);

  const handleLeaveChannel = () => {
    leaveChannel(activeConversation.id);
  };

  const openOwnerModal = () => {
    setOwnerModal(true);
  };

  const handleUpdateLabel = () => {
    setIsEditing(false);
    if (label === activeConversation.label) return setLabel(activeConversation.label);
    if (!label.trim()) return setLabel(activeConversation.label);

    updateChannelLabel({
      channelId: activeConversation.id,
      label,
    });
  };

  const isOwner = myPhoneNumber === activeConversation.owner;

  return (
    <Header background={backgroundColor}>
      <Box display="flex" alignItems="center" flexDirection="row" gap={1}>
        <IconButton onClick={goBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box display="flex" gap={2} alignItems="center">
          {isEditing ? (
            <TextField
              inputProps={{ style: { fontSize: 23 } }}
              value={label}
              onChange={(e) => setLabel(e.currentTarget.value)}
            />
          ) : (
            <Typography fontSize={26}>{label}</Typography>
          )}
          {isOwner && (
            <Box>
              {isEditing ? (
                <IconButton disableFocusRipple disableTouchRipple onClick={handleUpdateLabel}>
                  <CheckIcon />
                </IconButton>
              ) : (
                <IconButton
                  disableFocusRipple
                  disableTouchRipple
                  onClick={() => setIsEditing(true)}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
      </Box>
      <Box pr={2}>
        {isOwner ? (
          <IconButton onClick={openOwnerModal}>
            <AdminPanelSettingsIcon />
          </IconButton>
        ) : (
          <LeaveButton onClick={handleLeaveChannel}>Leave</LeaveButton>
        )}
      </Box>
    </Header>
  );
};

export default DarkChatHeader;
