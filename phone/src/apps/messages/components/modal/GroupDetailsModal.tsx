import React from 'react';
import Modal from '@ui/components/Modal';
import { Box, Button, Stack, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { findParticipants } from '../../utils/helpers';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useContactActions } from '../../../contacts/hooks/useContactActions';

interface GroupDetailsModalProps {
  open: boolean;
  onClose: () => void;
  conversationList: string;
  addContact: (number: any) => void;
}

const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({
  open,
  onClose,
  conversationList,
  addContact,
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

  return (
    <Modal visible={open} handleClose={onClose}>
      <Box>
        <Stack direction="row" spacing={4}>
          <Typography fontSize={20}>Details</Typography>
          {/*<Button size="small">Add participant</Button>*/}
        </Stack>
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
              {!contact && (
                <Button onClick={() => handleAddContact(participant)}>
                  <PersonAddIcon fontSize="medium" />
                </Button>
              )}
            </Box>
          </Box>
        );
      })}
    </Modal>
  );
};

export default GroupDetailsModal;
