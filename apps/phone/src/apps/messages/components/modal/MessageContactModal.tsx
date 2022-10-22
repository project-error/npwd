import React, { useState } from 'react';
import Modal from '@ui/components/Modal';
import { Autocomplete, Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useContactsValue } from '../../../contacts/hooks/state';
import { TextField } from '@ui/components/Input';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '../../../../../../typings/messages';
import useMessages from '../../hooks/useMessages';

interface MessageContactModalProps {
  isVisible: boolean;
  onClose: () => void;
  messageGroup: MessageConversation | undefined;
}

const MessageContactModal: React.FC<MessageContactModalProps> = ({
  isVisible,
  onClose,
  messageGroup,
}) => {
  const [t] = useTranslation();
  const contacts = useContactsValue();
  const [selectedContact, setSelectContact] = useState(null);
  const { sendEmbedMessage } = useMessageAPI();
  const { activeMessageConversation } = useMessages();

  const handleSendEmbedMessage = () => {
    sendEmbedMessage({
      conversationId: messageGroup.id,
      conversationList: activeMessageConversation.conversationList,
      embed: { type: 'contact', ...selectedContact },
      tgtPhoneNumber: messageGroup.participant,
      message: t('MESSAGES.CONTACT_SHARED'),
    });
    onClose();
  };

  return (
    <Modal visible={isVisible} handleClose={onClose}>
      <Box py={1}>
        <Typography paragraph>{t('MESSAGES.SHARE_CONTACT_TITLE')}</Typography>
      </Box>
      <Box pb={2}>
        <Autocomplete
          renderInput={(params) => <TextField {...params} label="Choose contact" />}
          getOptionLabel={(contact) => contact.display}
          options={contacts}
          onChange={(e, val) => setSelectContact(val)}
        />
      </Box>
      <Button
        disabled={!selectedContact}
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSendEmbedMessage}
      >
        {t('GENERIC.SHARE')}
      </Button>
    </Modal>
  );
};

export default MessageContactModal;
