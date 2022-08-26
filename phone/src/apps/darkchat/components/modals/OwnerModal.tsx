import React, { useState } from 'react';
import { List, ListItem, Modal, TextField, Tooltip } from '@ui/components';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, ListItemText, Tab, Typography } from '@mui/material';
import { Button } from '@ui/components/Button';
import { useDarkchatAPI } from '@apps/darkchat/hooks/useDarkchatAPI';
import { useHistory } from 'react-router-dom';
import { useActiveDarkchatValue, useDarkchatMembersValue } from '@apps/darkchat/state/state';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

interface OwnerModalProps {
  open: boolean;
  closeModal: () => void;
}

export const OwnerModal: React.FC<OwnerModalProps> = ({ open, closeModal }) => {
  const [channelValue, setChannelValue] = useState<string>('');
  const [tabValue, setTabValue] = useState<string>('1');
  const channelMembers = useDarkchatMembersValue();
  const myPhoneNumber = useMyPhoneNumber();

  const filteredMembers =
    channelMembers && channelMembers.filter((member) => member.phoneNumber !== myPhoneNumber);

  const [t] = useTranslation();
  const { transferOwnership, deleteChannel } = useDarkchatAPI();
  const history = useHistory();
  const activeDarkChat = useActiveDarkchatValue();

  const canDelete = activeDarkChat.identifier === channelValue;

  const isOwner = activeDarkChat.owner === myPhoneNumber;

  const handleDeleteChannel = () => {
    // del
    closeModal();
    deleteChannel(activeDarkChat.id);
    history.push('/darkchat');
  };

  const handleTransferOwnership = (memberIdentifier: string, phoneNumber: string) => {
    closeModal();
    transferOwnership(activeDarkChat.id, memberIdentifier, phoneNumber);
  };

  const handleTabChange = (e, value) => {
    setTabValue(value);
  };

  return (
    <Modal visible={open} handleClose={closeModal}>
      <TabContext value={tabValue}>
        <TabList indicatorColor="secondary" textColor="secondary" onChange={handleTabChange}>
          <Tab label="Members" value="1" />
          <Tab label="Danger zone" value="2" />
        </TabList>
        <TabPanel value="1">
          <List>
            {filteredMembers &&
              filteredMembers.map((member) => (
                <ListItem
                  secondaryAction={
                    <Tooltip title="Transfer ownership" placement="left">
                      <IconButton
                        onClick={() =>
                          handleTransferOwnership(member.identifier, member.phoneNumber)
                        }
                        edge="end"
                        aria-label="delete"
                      >
                        <SwapHorizIcon />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  {/* This is anon, so should we really show their name???????? */}
                  <ListItemText>{member.phoneNumber}</ListItemText>
                </ListItem>
              ))}
          </List>
        </TabPanel>
        {isOwner && (
          <TabPanel value="2">
            <Typography>{t('DARKCHAT.DELETE_CHANNEL_TITLE')}</Typography>

            <Box mt={2} mb={2}>
              <Typography>
                Type <span style={{ fontWeight: 'bold' }}>{activeDarkChat.identifier}</span> to
                confirm.
              </Typography>

              <Box display="flex" flexDirection="column" alignItems="flex-start" gap={2}>
                <TextField
                  placeholder="Channel ID"
                  value={channelValue}
                  onChange={(e) => setChannelValue(e.currentTarget.value)}
                />
                <Button
                  onClick={handleDeleteChannel}
                  disabled={!canDelete}
                  variant="outlined"
                  color="secondary"
                >
                  {t('GENERIC.DELETE')}
                </Button>
              </Box>
            </Box>
          </TabPanel>
        )}
      </TabContext>
    </Modal>
  );
};
