import React, { useEffect, useState } from 'react';
import Modal from '../../../../ui/components/Modal';
import { Box, Popper, Autocomplete, Button } from '@mui/material';
import { TextField } from '@ui/components/Input';
import { PreDBContact, Contact } from '@typings/contact';
import { useContactsValue } from '../../../contacts/hooks/state';
import { useTranslation } from 'react-i18next';

const AddParticipantModal = ({
  open,
  onClose,
  participants,
  myPhoneNumber,
  handleAddGroupMembers,
}: {
  open: boolean;
  onClose: () => void;
  participants: string[];
  myPhoneNumber: string;
  handleAddGroupMembers: (members: string[]) => void;
}) => {
  const [newParticipants, setNewParticipants] = useState<PreDBContact[]>([]);
  const [allowedContact, setAllowedContact] = useState<Contact[]>([]);
  const contacts = useContactsValue();
  const [t] = useTranslation();

  useEffect(() => {
    setAllowedContact(contacts.filter((contact) => !participants.includes(contact.number)));
  }, [participants, contacts]);

  const handleSubmit = () => {
    const selectedParticipants = newParticipants.map((participant) => participant.number);
    handleAddGroupMembers(selectedParticipants);
    setNewParticipants([]);
    onClose();
  };

  const handleCLose = () => {
    setNewParticipants([]);
    onClose();
  };

  const onAutocompleteChange = (_e, value: any) => {
    const lastIdx = value.length - 1;

    // If we have a string, it means that we don't have the number as a contact.
    if (typeof value[lastIdx] === 'string') {
      value.splice(lastIdx, 1, { number: value[lastIdx] });
      setNewParticipants(value);
      return;
    }
    // If we have the contact
    setNewParticipants(value as any[]);
  };

  const renderAutocompleteInput = (params) => (
    <TextField
      {...params}
      fullWidth
      label={t('MESSAGES.INPUT_NAME_OR_NUMBER')}
      inputProps={{
        ...params.inputProps,
        onKeyPress: (e) => {
          if (e.key === 'Enter' && e.currentTarget.value) {
            e.preventDefault();
            onAutocompleteChange(e, [...newParticipants, e.currentTarget.value]);
          }
        },
        autoFocus: true,
      }}
    />
  );

  const isYourself = newParticipants.find((p) => p.number === myPhoneNumber);
  const disableSubmit = !newParticipants?.length || !!isYourself;

  return (
    <Modal visible={open} handleClose={handleCLose}>
      <Box px={2} py={3}>
        <Autocomplete
          value={newParticipants}
          freeSolo
          disablePortal
          PopperComponent={(props) => <Popper placement="bottom-start" {...props} />}
          multiple
          autoHighlight
          options={allowedContact || []}
          ListboxProps={{ style: { marginLeft: 10 } }}
          getOptionLabel={(contact) => contact.display || contact.number}
          onChange={onAutocompleteChange}
          renderInput={renderAutocompleteInput}
        />
      </Box>
      <Button
        onClick={handleSubmit}
        disabled={disableSubmit}
        variant="contained"
        fullWidth
        sx={{ mb: 1 }}
        color="primary"
        type="submit"
      >
        {t('GENERIC.ADD')}
      </Button>
    </Modal>
  );
};

export default AddParticipantModal;
