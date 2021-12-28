import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { ContextMenu } from '@ui/components/ContextMenu';
import { useSelectedMessageValue } from '../../hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';

interface MessageBubbleMenuProps {
  open: boolean;
  handleClose: () => void;
}

const MessageBubbleMenu: React.FC<MessageBubbleMenuProps> = ({ open, handleClose }) => {
  const [t] = useTranslation();
  const { deleteMessage } = useMessageAPI();
  const selectedMessage = useSelectedMessageValue();

  const handleDeleteMessage = useCallback(() => {
    deleteMessage(selectedMessage);
  }, [deleteMessage, selectedMessage]);

  const menuOptions = useMemo(
    () => [
      {
        label: t('MESSAGES.FEEDBACK.DELETE_MESSAGE'),
        icon: <PhotoLibraryIcon />,
        onClick: handleDeleteMessage,
      },
    ],
    [handleDeleteMessage, t],
  );

  return <ContextMenu open={open} onClose={handleClose} options={menuOptions} />;
};

export default MessageBubbleMenu;
