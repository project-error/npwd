import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Popper } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { Autocomplete } from '@mui/material';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { TextField } from '@ui/components/Input';
import { useContactsValue } from '../../../contacts/hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';

const NewMessageGroupForm = ({ phoneNumber }: { phoneNumber?: string }) => {
  const history = useHistory();
  const [t] = useTranslation();
  const [participant, setParticipant] = useState<any>('');
  const [participantValue, setParticipantValue] = useState('');
  const { getContactByNumber } = useContactActions();
  const contacts = useContactsValue();
  const { addConversation } = useMessageAPI();

  useEffect(() => {
    if (phoneNumber) {
      const find = getContactByNumber(phoneNumber);
      if (find) {
        setParticipant(find);
      } else {
        setParticipantValue(phoneNumber);
      }
    }
  }, [phoneNumber, getContactByNumber]);

  const handleSubmit = () => {
    if (participantValue || participant) {
      const targetNumber = participant.number ?? participantValue;
      addConversation(targetNumber);
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  const renderAutocompleteInput = (params) => (
    <TextField
      {...params}
      fullWidth
      label={t('MESSAGES.INPUT_NAME_OR_NUMBER')}
      onChange={(e) => setParticipant(e.currentTarget.value)}
    />
  );

  const submitDisabled = !participantValue && !participant;

  return (
    <Box>
      <Box px={2} py={3}>
        <Autocomplete
          value={participant}
          inputValue={participantValue}
          freeSolo
          disablePortal
          PopperComponent={(props) => <Popper placement="bottom-start" {...props} />}
          autoHighlight
          options={contacts}
          // I am so sorry
          ListboxProps={{ style: { marginLeft: 10 } }}
          getOptionLabel={(contact) => contact.display || contact.number || participant}
          onChange={(e, value: any) => setParticipant(value)}
          onInputChange={(e, value: any) => setParticipantValue(value)}
          renderInput={renderAutocompleteInput}
        />
      </Box>
      <Box px={2} py={3}>
        <Button
          onClick={() => handleSubmit()}
          disabled={submitDisabled}
          variant="contained"
          fullWidth
          sx={{ mb: 1 }}
          color="primary"
          type="submit"
        >
          {t('MESSAGES.NEW_MESSAGE_GROUP_SUBMIT')}
        </Button>
        <Button onClick={handleCancel} variant="contained" fullWidth color="error">
          {t('GENERIC_CANCEL')}
        </Button>
      </Box>
    </Box>
  );
};

export default NewMessageGroupForm;
