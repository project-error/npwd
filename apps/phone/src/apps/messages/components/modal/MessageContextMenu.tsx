import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContextMenu, IContextMenuOption } from '@ui/components/ContextMenu';
import qs from 'qs';
import { useHistory, useLocation } from 'react-router-dom';
import { MessageImageModal } from './MessageImageModal';
import MessageContactModal from './MessageContactModal';
import { MessageConversation, MessageEvents } from '@typings/messages';
import fetchNui from '../../../../utils/fetchNui';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import useMessages from '../../hooks/useMessages';
import { Location } from '@typings/messages';
import { MessageNoteModal } from './MessageNoteModal';
import { BookImage, BookUser, MapPinned, StickyNote } from 'lucide-react';

interface MessageCtxMenuProps {
  isOpen: boolean;
  onClose: () => void;
  messageGroup: MessageConversation | undefined;
  image?: string;
  note?: string;
}

const MessageContextMenu: React.FC<MessageCtxMenuProps> = ({
  isOpen,
  onClose,
  messageGroup,
  image,
  note,
}) => {
  const history = useHistory();
  const [t] = useTranslation();
  const { pathname, search } = useLocation();
  const [imagePreview, setImagePreview] = useState(null);
  const [notePreview, setNotePreview] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState<boolean>(false);
  const { sendEmbedMessage } = useMessageAPI();
  const { activeMessageConversation } = useMessages();

  const menuOptions: IContextMenuOption[] = useMemo(
    () => [
      {
        label: t('MESSAGES.MEDIA_OPTION'),
        icon: <BookImage />,
        onClick: () =>
          history.push(
            `/camera?${qs.stringify({
              referal: encodeURIComponent(pathname + search),
            })}`,
          ),
      },
      {
        label: t('MESSAGES.CONTACT_OPTION'),
        icon: <BookUser />,
        onClick: () => setContactModalOpen(true),
      },
      {
        label: t('MESSAGES.NOTE_OPTION'),
        icon: <StickyNote />,
        onClick: () =>
          history.push(
            `/notes?${qs.stringify({
              referal: encodeURIComponent(pathname + search),
            })}`,
          ),
      },
      {
        label: t('MESSAGES.LOCATION_OPTION'),
        icon: <MapPinned />,
        onClick: () => {
          fetchNui<{ data: Location }>(MessageEvents.GET_MESSAGE_LOCATION).then(({ data }) => {
            sendEmbedMessage({
              conversationId: messageGroup.id,
              conversationList: activeMessageConversation.conversationList,
              embed: { type: 'location', ...data },
              tgtPhoneNumber: messageGroup.participant,
              message: t('MESSAGES.LOCATION_MESSAGE'),
            });
          });
        },
      },
    ],
    [history, pathname, search, t, sendEmbedMessage, activeMessageConversation, messageGroup],
  );

  return (
    <>
      <ContextMenu open={isOpen} onClose={onClose} options={menuOptions} />
      <MessageImageModal
        image={image}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        messageGroup={messageGroup}
        onClose={onClose}
      />
      <MessageNoteModal
        noteId={note}
        notePreview={notePreview}
        setNotePreview={setNotePreview}
        messageGroup={messageGroup}
        onClose={onClose}
      />

      <MessageContactModal
        messageGroup={messageGroup}
        isVisible={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </>
  );
};

export default MessageContextMenu;
