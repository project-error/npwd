import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, TextField } from '@material-ui/core';

import Nui from '../../../../os/nui-events/utils/Nui';
import { useHistory } from 'react-router-dom';
import { Autocomplete } from '@material-ui/lab';
import { useContacts } from '../../../contacts/hooks/useContacts';
import { Contact } from '../../../../common/typings/contact';

const NewMessageGroupForm = ({ phoneNumber }: { phoneNumber?: string }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [participants, setParticipants] = useState([]);
  const [label, setLabel] = useState('');
  const { contacts } = useContacts();

  useEffect(() => {
    if (phoneNumber) {
      const find = contacts.find((c) => c.number === phoneNumber);
      const newPart = find || { number: phoneNumber };
      setParticipants((all) => [...all, newPart]);
    }
  }, [phoneNumber, contacts]);

  const isGroupChat = participants.length > 1;

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      // handles phone numbers in a csv format and strips all spaces and
      // external characters out of them:
      // 123-4567, 987-6543, 333-4444
      const phoneNumbers = participants.map(({ number }) =>
        number.replace(/[^0-9]/g, ''),
      );
      const labelValue = isGroupChat ? label.trim() : null;

      if (phoneNumbers.length) {
        Nui.send('phone:createMessageGroup', {
          phoneNumbers,
          label: labelValue,
        });
        setParticipants([]);
        history.push('/messages');
      }
    },
    [history, label, participants, isGroupChat],
  );

  const onAutocompleteChange = useCallback((_e, value: any) => {
    const lastIdx = value.length - 1;
    if (typeof value[lastIdx] === 'string') {
      value.splice(lastIdx, 1, { number: value[lastIdx] });
      setParticipants(value);
      return;
    }
    setParticipants(value as any[]);
  }, []);

  const renderAutocompleteInput = useCallback(
    (params) => (
      <TextField
        {...params}
        fullWidth
        label={t('APPS_MESSAGES_INPUT_NAME_OR_NUMBER')}
        inputProps={{
          ...params.inputProps,
          autoFocus: true,
        }}
      />
    ),
    [t],
  );

  const submitDisabled = !participants.length || (isGroupChat && !label);

  return (
    <form onSubmit={handleSubmit}>
      <Box px={2} py={3}>
        <Autocomplete<Contact, boolean, boolean, boolean>
          value={participants}
          multiple
          freeSolo
          autoHighlight
          options={contacts || []}
          getOptionLabel={(c) => c.display || c.number}
          onChange={onAutocompleteChange}
          renderInput={renderAutocompleteInput}
        />
      </Box>
      {isGroupChat && (
        <Box px={2} py={3}>
          <TextField
            fullWidth
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={t('APPS_MESSAGES_GROUP_CHAT_LABEL')}
          />
        </Box>
      )}
      <Box px={2} py={3}>
        <Button
          disabled={submitDisabled}
          variant="contained"
          fullWidth
          color="primary"
          type="submit"
        >
          {t('APPS_MESSAGES_NEW_MESSAGE_GROUP_SUBMIT')}
        </Button>
      </Box>
    </form>
  );
};

export default NewMessageGroupForm;
