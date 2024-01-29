import React, { useState } from 'react';
import { Modal2 } from '@ui/components/Modal';
import { Autocomplete } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useContactsValue } from '../../../contacts/hooks/state';
import { TextField } from '@ui/components/Input';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '@typings/messages';
import useMessages from '../../hooks/useMessages';
import { NPWDButton } from '@npwd/keyos';

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
    <Modal2 visible={isVisible} handleClose={onClose}>
      <div className="py-1">
        <p className="text-sm text-neutral-900 dark:text-neutral-50">
          {t('MESSAGES.SHARE_CONTACT_TITLE')}
        </p>
      </div>
      <div className="pb-2">
        <Autocomplete
          renderInput={(params) => <TextField {...params} label="Choose contact" />}
          getOptionLabel={(contact) => contact.display}
          options={contacts}
          onChange={(_, val) => setSelectContact(val)}
        />
      </div>
      <NPWDButton
        disabled={!selectedContact}
        size="sm"
        className="w-full bg-green-600 disabled:bg-gray-500/30 disabled:text-gray-500"
        onClick={handleSendEmbedMessage}
      >
        {t('GENERIC.SHARE')}
      </NPWDButton>
    </Modal2>
  );
};

export default MessageContactModal;
