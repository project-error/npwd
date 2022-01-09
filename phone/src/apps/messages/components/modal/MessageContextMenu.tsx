import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { ContextMenu, IContextMenuOption } from '../../../../ui/components/ContextMenu';
import qs from 'qs';
import { useHistory, useLocation } from 'react-router-dom';
import { MessageImageModal } from './MessageImageModal';
import MessageContactModal from './MessageContactModal';
import makeStyles from '@mui/styles/makeStyles';

interface MessageCtxMenuProps {
  isOpen: boolean;
  onClose: () => void;
  messageGroupId: string | undefined;
  image?: string;
}

const useStyles = makeStyles(() => ({
  backgroundModal: {
    background: 'black',
    opacity: '0.6',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
}));

const MessageContextMenu: React.FC<MessageCtxMenuProps> = ({
  isOpen,
  onClose,
  messageGroupId,
  image,
}) => {
  const history = useHistory();
  const [t] = useTranslation();
  const { pathname, search } = useLocation();
  const [imagePreview, setImagePreview] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState<boolean>(false);
  const classes = useStyles();

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
      {
        label: t('MESSAGES.CONTACT_OPTION'),
        icon: <ContactPageIcon />,
        onClick: () => setContactModalOpen(true),
      },
    ],
    [history, pathname, search, t],
  );

  return (
    <>
      <ContextMenu open={isOpen} onClose={onClose} options={menuOptions} />
      <div className={modalsVisible ? classes.backgroundModal : undefined} />
      <MessageImageModal
        image={image}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        messageGroupId={messageGroupId}
        onClose={onClose}
      />
      <MessageContactModal
        messageGroupId={messageGroupId}
        isVisible={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </>
  );
};

export default MessageContextMenu;
