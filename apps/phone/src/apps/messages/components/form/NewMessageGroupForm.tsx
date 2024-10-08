import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Popper } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { Autocomplete } from '@mui/material';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { TextField } from '@ui/components/Input';
import { useContactsValue } from '../../../contacts/hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { PreDBConversation } from '@typings/messages';
import { PreDBContact } from '@typings/contact';

const NewMessageGroupForm = ({ phoneNumber }: { phoneNumber?: string }) => {
  const history = useHistory();
  const [t] = useTranslation();
  const [participants, setParticipants] = useState<PreDBContact[]>([]);
  const [conversationLabel, setConversationLabel] = useState<string>('');
  const { getContactByNumber } = useContactActions();
  const contacts = useContactsValue();
  const { addConversation } = useMessageAPI();

  const myPhoneNumber = useMyPhoneNumber();

  const isGroupChat = participants.length > 1;

  const handleSubmit = () => {
    const selectedParticipants = participants.map((participant) => participant.number);

    const dto: PreDBConversation = {
      conversationLabel: isGroupChat ? conversationLabel : '',
      participants: [myPhoneNumber, ...selectedParticipants],
      isGroupChat,
    };

    addConversation(dto);
  };

  const hello = () => {
    console.log('hello');
  };

  useEffect(() => {
    if (phoneNumber) {
      const contact = getContactByNumber(phoneNumber) || {
        display: '',
        number: phoneNumber,
      };
      setParticipants((curVal) => [...curVal, contact]);
    }
  }, [phoneNumber, getContactByNumber]);

  const handleCancel = () => {
    history.goBack();
  };

  const onAutocompleteChange = (_e, value: any) => {
    const lastIdx = value.length - 1;

    // If we have a string, it means that we don't have the number as a contact.
    if (typeof value[lastIdx] === 'string') {
      value.splice(lastIdx, 1, { number: value[lastIdx] });
      setParticipants(value);
      return;
    }
    // If we have the contact
    setParticipants(value as any[]);
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
            onAutocompleteChange(e, [...participants, e.currentTarget.value]);
          }
        },
        autoFocus: true,
      }}
    />
  );

  const isYourself = participants.find((p) => p.number === myPhoneNumber);
  const disableSubmit =
    !participants?.length || (isGroupChat && !conversationLabel) || !!isYourself;

  return (
    <Box>
      <Box px={2} py={3}>
        <Autocomplete
          value={participants}
          freeSolo
          disablePortal
          PopperComponent={(props) => <Popper placement="bottom-start" {...props} />}
          multiple
          autoHighlight
          options={contacts || []}
          ListboxProps={{ style: { marginLeft: 10 } }}
          getOptionLabel={(contact) => contact.display || contact.number}
          onChange={onAutocompleteChange}
          renderInput={renderAutocompleteInput}
        />
      </Box>
      {isGroupChat && (
        <Box px={2} py={1}>
          <TextField
            fullWidth
            placeholder="Conversation label"
            value={conversationLabel}
            onChange={(e) => setConversationLabel(e.currentTarget.value)}
          />
        </Box>
      )}
      <div className="space-y-2 px-3 py-2">
        <button
          className="w-full rounded-md bg-green-600 py-2 text-sm font-medium hover:bg-green-700 disabled:bg-gray-500/50 disabled:text-gray-500"
          onClick={handleSubmit}
          disabled={disableSubmit}
          variant="contained"
          type="submit"
        >
          {t('MESSAGES.NEW_MESSAGE_GROUP_SUBMIT')}
        </button>
        <button
          onClick={handleCancel}
          variant="contained"
          className="w-full rounded-md bg-red-700 py-2 text-sm font-medium hover:bg-red-800"
        >
          {t('GENERIC_CANCEL')}
        </button>
      </div>
    </Box>
  );
};

export default NewMessageGroupForm;
