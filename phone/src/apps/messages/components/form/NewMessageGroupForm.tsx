import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { Autocomplete } from '@mui/material';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { Contact } from '../../../../../../typings/contact';
import { MessageConversationResponse, MessageEvents } from '../../../../../../typings/messages';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';
import { TextField } from '../../../../ui/components/Input';
import { useContactsValue } from '../../../contacts/hooks/state';
import { fetchNui } from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../../typings/common';
import { useMessageActions } from '../../hooks/useMessageActions';

const NewMessageGroupForm = ({ phoneNumber }: { phoneNumber?: string }) => {
  const history = useHistory();
  const [t] = useTranslation();
  const { addAlert } = useSnackbar();
  const [participant, setParticipant] = useState<any>('');
  const { getDisplayByNumber, getPictureByNumber, getContactByNumber } = useContactActions();
  const contacts = useContactsValue();
  const { updateConversations } = useMessageActions();

  useEffect(() => {
    if (phoneNumber) {
      const find = getContactByNumber(phoneNumber) || phoneNumber;
      setParticipant(find);
    }
  }, [phoneNumber, getContactByNumber]);

  const handleSubmit = useCallback(() => {
    // handles phone numbers in a csv format and strips all spaces and
    // external characters out of them:
    // 123-4567, 987-6543, 333-4444
    /* participant.map(({ number }) => number.replace(/[^0-9]/g, '')); */

    if (participant) {
      fetchNui<ServerPromiseResp<MessageConversationResponse>>(
        MessageEvents.CREATE_MESSAGE_CONVERSATION,
        {
          targetNumber: participant.number || participant,
        },
      ).then((resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            message: t('APPS_MESSAGES_MESSAGE_GROUP_CREATE_ONE_NUMBER_FAILED'),
            type: 'error',
          });
        }

        const display = getDisplayByNumber(resp.data.phoneNumber);
        const avatar = getPictureByNumber(resp.data.phoneNumber);

        updateConversations({
          phoneNumber: resp.data.phoneNumber,
          conversation_id: resp.data.conversation_id,
          display,
          unread: 0,
          avatar,
        });

        setParticipant(null);
        history.push('/messages');
      });
    }
  }, [
    history,
    participant,
    addAlert,
    t,
    updateConversations,
    getDisplayByNumber,
    getPictureByNumber,
  ]);

  const renderAutocompleteInput = (params) => (
    <TextField
      {...params}
      fullWidth
      label={t('APPS_MESSAGES_INPUT_NAME_OR_NUMBER')}
      onChange={(e) => setParticipant(e.currentTarget.value)}
    />
  );

  const submitDisabled = !participant;

  return (
    <Box>
      <Box px={2} py={3}>
        <Autocomplete<Contact, boolean, boolean, boolean>
          freeSolo
          autoHighlight
          options={contacts}
          getOptionLabel={(contact) => contact.display || contact.number || participant}
          onChange={(e, value: any) => setParticipant(value)}
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
