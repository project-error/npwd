import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { useHistory } from 'react-router-dom';
import { Autocomplete } from '@mui/material';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { Contact } from '../../../../../../typings/contact';
import { MessageEvents } from '../../../../../../typings/messages';
// import { PHONE_NUMBER_REGEX } from '../../../../../../typings/phone';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';
import { TextField } from '../../../../ui/components/Input';
import { useContactsValue } from '../../../contacts/hooks/state';
import { fetchNui } from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../../typings/common';

const NewMessageGroupForm = ({ phoneNumber }: { phoneNumber?: string }) => {
  const Nui = useNuiRequest();
  const history = useHistory();
  const { t } = useTranslation();
  const { addAlert } = useSnackbar();
  const [participant, setParticipant] = useState(null);
  const { getContactByNumber } = useContactActions();
  const contacts = useContactsValue();

  useEffect(() => {
    if (phoneNumber) {
      const find = getContactByNumber(phoneNumber) || { number: phoneNumber };
      setParticipant((all) => [...all, find]);
    }
  }, [phoneNumber, getContactByNumber]);

  const handleSubmit = useCallback(() => {
    console.log('part', participant);

    // handles phone numbers in a csv format and strips all spaces and
    // external characters out of them:
    // 123-4567, 987-6543, 333-4444
    /* participant.map(({ number }) => number.replace(/[^0-9]/g, '')); */

    if (participant) {
      fetchNui<ServerPromiseResp<boolean>>(MessageEvents.CREATE_MESSAGE_CONVERSATION, {
        targetNumber: participant.number,
      }).then((resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            message: t('APPS_MESSAGES_MESSAGE_GROUP_CREATE_ONE_NUMBER_FAILED'),
            type: 'error',
          });
        }
      });

      setParticipant(null);
      history.push('/messages');
    }
  }, [history, Nui, participant, addAlert, t]);

  const onAutocompleteChange = (_e, value: any) => {
    if (value) {
      const isValid = true; // PHONE_NUMBER_REGEX.test(value[lastIdx]);
      if (!isValid) {
        return addAlert({ message: t('APPS_MESSAGES_INVALID_PHONE_NUMBER'), type: 'error' });
      }

      setParticipant(value);
      return;
    }
    setParticipant(value);
  };

  const renderAutocompleteInput = (params) => (
    <TextField
      {...params}
      fullWidth
      label={t('APPS_MESSAGES_INPUT_NAME_OR_NUMBER')}
      inputProps={{
        ...params.inputProps,
        onKeyPress: (e) => {
          if (e.key === 'Enter' && e.currentTarget.value) {
            e.preventDefault();
            onAutocompleteChange(e, [...participant, e.currentTarget.value]);
          }
        },
        autoFocus: true,
      }}
    />
  );

  const submitDisabled = !participant;

  return (
    <Box>
      <Box px={2} py={3}>
        <Autocomplete<Contact, boolean, boolean, boolean>
          value={participant}
          freeSolo
          autoHighlight
          options={contacts || []}
          getOptionLabel={(c) => c.display || c.number}
          onChange={onAutocompleteChange}
          renderInput={renderAutocompleteInput}
        />
      </Box>
      <Box px={2} py={3}>
        <Button
          onClick={() => handleSubmit()}
          disabled={submitDisabled}
          variant="contained"
          fullWidth
          color="primary"
          type="submit"
        >
          {t('APPS_MESSAGES_NEW_MESSAGE_GROUP_SUBMIT')}
        </Button>
      </Box>
    </Box>
  );
};

export default NewMessageGroupForm;
