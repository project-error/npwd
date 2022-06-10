import React from 'react';
import Modal from '@ui/components/Modal';
import { Box, Button, Stack, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { findParticipants } from '../../utils/helpers';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useContactActions } from '../../../contacts/hooks/useContactActions';

interface GroupDetailsModalProps {
  open: boolean;
  onClose: () => void;
  conversationList: string;
  createdBy: string;
  addContact: (number: any) => void;
  removeMember: (number: any) => void;
  leaveGroup: () => void;
}

const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({
  open,
  onClose,
  conversationList,
  createdBy,
  addContact,
  removeMember,
  leaveGroup,
}) => {
  const myPhoneNumber = useMyPhoneNumber();
  const { getContactByNumber } = useContactActions();

  const participants = findParticipants(conversationList, myPhoneNumber);

  const findContact = (phoneNumber: string) => {
    return getContactByNumber(phoneNumber);
  };

  const handleAddContact = (participant: string) => {
    addContact(participant);
  };

  const handleGroupRemove = (participant: string) => {
    removeMember(participant);
  };

  return (
    <Modal visible={open} handleClose={onClose}>
      <Box>
        <Typography fontSize={20}>Details</Typography>
      </Box>
      {participants.map((participant) => {
        const contact = findContact(participant);

        return (
          <Box mt={2} key={participant}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={2}>
                <PersonIcon fontSize="medium" />
                <Typography fontSize={18}>{contact?.display ?? participant}</Typography>
              </Stack>
              <Box>
                {!contact && (
                  <Button onClick={() => handleAddContact(participant)}>
                    <PersonAddIcon fontSize="medium" />
                  </Button>
                )}
                {myPhoneNumber === createdBy && (
                  <Button onClick={() => handleGroupRemove(participant)}>
                    <PersonRemoveIcon fontSize="medium" />
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        );
      })}
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          justifyContent: 'space-evenly',
        }}
      >
        <Button size="medium" onClick={leaveGroup}>
          Leave Group
        </Button>
      </Box>
    </Modal>
  );
};

export default GroupDetailsModal;
