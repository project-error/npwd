import React, { useState } from 'react';
import { Modal2 } from '@ui/components/Modal';
import { useTranslation } from 'react-i18next';
import { useContactsValue } from '../../../contacts/hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '@typings/messages';
import useMessages from '../../hooks/useMessages';
import { Button } from '@npwd/keyos';
import { Contact } from '@typings/contact';

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
  const [selectedContact, setSelectContact] = useState<Contact | null>(null);
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
        <p className="text-sm font-semibold text-keyos-cream">
          {t('MESSAGES.SHARE_CONTACT_TITLE')}
        </p>
      </div>
      <div className="pb-2">
        <select
          className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-keyos-cream outline-none"
          onChange={(event) => {
            const contact = contacts.find((item) => item.number === event.currentTarget.value);
            setSelectContact(contact ?? null);
          }}
          value={selectedContact?.number ?? ''}
        >
          <option value="">Choose contact</option>
          {contacts.map((contact) => (
            <option key={contact.number} value={contact.number}>
              {contact.display}
            </option>
          ))}
        </select>
      </div>
      <Button
        disabled={!selectedContact}
        size="sm"
        className="w-full bg-[color:var(--keyos-app-accent)] text-[color:var(--keyos-app-accent-foreground)] disabled:bg-gray-500/30 disabled:text-gray-500"
        onClick={handleSendEmbedMessage}
      >
        {t('GENERIC.SHARE')}
      </Button>
    </Modal2>
  );
};

export default MessageContactModal;
