import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { ContextMenu, IContextMenuOption } from '../../../../ui/components/ContextMenu';
import qs from 'qs';
import { useHistory, useLocation } from 'react-router-dom';
import { MessageImageModal } from './MessageImageModal';
import MessageContactModal from './MessageContactModal';
import Backdrop from '../../../../ui/components/Backdrop';
import { MessageConversation } from '../../../../../../typings/messages';

interface MessageCtxMenuProps {
  isOpen: boolean;
  onClose: () => void;
  messageGroup: MessageConversation | undefined;
  image?: string;
}

const MessageContextMenu: React.FC<MessageCtxMenuProps> = ({
  isOpen,
  onClose,
  messageGroup,
  image,
}) => {
  const history = useHistory();
  const [t] = useTranslation();
  const { pathname, search } = useLocation();
  const [imagePreview, setImagePreview] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState<boolean>(false);

  const modalsVisible = imagePreview || contactModalOpen;

  const menuOptions: IContextMenuOption[] = useMemo(
    () => [
      {
        label: t('MESSAGES.MEDIA_OPTION'),
        icon: <PhotoLibraryIcon />,
        onClick: () =>
          history.push(
            `/camera?${qs.stringify({
              referal: encodeURIComponent(pathname + search),
            })}`,
          ),
      },
      // This feature causes a shitshow of re-renders.
      // It's caused by the 'activeMessageConversation' state in 'MessageModal'. No clue what's going on, and I don't have the brain for it now.
      /*
      {
        label: t('MESSAGES.CONTACT_OPTION'),
        icon: <ContactPageIcon />,
        onClick: () => setContactModalOpen(true),
      },
*/
    ],
    [history, pathname, search, t],
  );

  return (
    <>
      <ContextMenu open={isOpen} onClose={onClose} options={menuOptions} />
      {modalsVisible ? <Backdrop /> : undefined}
      <MessageImageModal
        image={image}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        messageGroup={messageGroup}
        onClose={onClose}
      />
      {/*
      <MessageContactModal
        messageGroup={messageGroup}
        isVisible={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
*/}
    </>
  );
};

export default MessageContextMenu;
