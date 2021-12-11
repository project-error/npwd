import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Popper } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { Autocomplete } from '@mui/material';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { MessageConversationResponse, MessageEvents } from '@typings/messages';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { TextField } from '@ui/components/Input';
import { useContactsValue } from '../../../contacts/hooks/state';
import { fetchNui } from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useMessageActions } from '../../hooks/useMessageActions';
import { useMessageConversationsValue } from '../../hooks/state';

const NewMessageGroupForm = ({ phoneNumber }: { phoneNumber?: string }) => {
  const history = useHistory();
  const [t] = useTranslation();
  const { addAlert } = useSnackbar();
  const [participant, setParticipant] = useState<any>('');
  const [participantValue, setParticipantValue] = useState('');
  const { getDisplayByNumber, getPictureByNumber, getContactByNumber } = useContactActions();
  const contacts = useContactsValue();
  const { updateConversations } = useMessageActions();
  const messageConversations = useMessageConversationsValue();

  useEffect(() => {
    if (phoneNumber) {
      console.log('phone number', phoneNumber);
      const find = getContactByNumber(phoneNumber);
      if (find) {
        setParticipant(find);
      } else {
        setParticipantValue(phoneNumber);
      }
    }
  }, [phoneNumber, getContactByNumber]);

  // TODO: Abstract functionality
  const handleSubmit = useCallback(() => {
    // handles phone numbers in a csv format and strips all spaces and
    // external characters out of them:
    // 123-4567, 987-6543, 333-4444
    /* participant.map(({ number }) => number.replace(/[^0-9]/g, '')); */

    if (participantValue || participant) {
      fetchNui<ServerPromiseResp<MessageConversationResponse>>(
        MessageEvents.CREATE_MESSAGE_CONVERSATION,
        {
          targetNumber: participant.number ?? participantValue,
        },
      ).then((resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            message: t('MESSAGES.FEEDBACK.MESSAGE_GROUP_CREATE_ONE_NUMBER_FAILED', {
              number: participant.number ?? participantValue,
            }),
            type: 'error',
          });
        }

        const doesConversationExist = messageConversations.find(
          (c) => c.conversation_id === resp.data.conversation_id,
        );
        if (doesConversationExist)
          return addAlert({
            message: t('MESSAGES.FEEDBACK.MESSAGE_CONVERSATION_DUPLICATE'),
            type: 'error',
          });

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
    participantValue,
    participant,
    messageConversations,
    addAlert,
    t,
    updateConversations,
    getDisplayByNumber,
    getPictureByNumber,
  ]);

  const handleCancel = () => {
    history.push('/messages');
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
