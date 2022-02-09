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
  const [participants, setParticipants] = useState<any>([]);
  const { getContactByNumber } = useContactActions();
  const contacts = useContactsValue();
  const { addConversation } = useMessageAPI();

  const handleSubmit = () => {
    console.log(participants);
  };

  const handleCancel = () => {
    history.push('/messages');
  };

  const renderAutocompleteInput = (params) => (
    <TextField {...params} fullWidth label={t('MESSAGES.INPUT_NAME_OR_NUMBER')} />
  );

  return (
    <Box>
      <Box px={2} py={3}>
        <Autocomplete
          freeSolo
          disablePortal
          PopperComponent={(props) => <Popper placement="bottom-start" {...props} />}
          multiple
          autoHighlight
          options={contacts}
          ListboxProps={{ style: { marginLeft: 10 } }}
          getOptionLabel={(contact) => contact.display || contact.number}
          onChange={(e, value: any) => setParticipants(value)}
          renderInput={renderAutocompleteInput}
        />
      </Box>
      <Box px={2} py={3}>
        <Button
          onClick={handleSubmit}
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
