import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ContextMenu } from '@ui/components/ContextMenu';
import { useSelectedMessageValue } from '../../hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { Message } from '@typings/messages';
import { usePhotoAPI } from '@apps/camera/hooks/usePhotoAPI';
import { ImageDown, Trash2 } from 'lucide-react';

interface MessageBubbleMenuProps {
  open: boolean;
  handleClose: () => void;
  isImage?: boolean;
  message?: Message;
}

const MessageBubbleMenu: React.FC<MessageBubbleMenuProps> = ({
  open,
  handleClose,
  isImage,
  message,
}) => {
  const [t] = useTranslation();
  const { deleteMessage } = useMessageAPI();
  const { saveImage } = usePhotoAPI();
  const selectedMessage = useSelectedMessageValue();

  const handleDeleteMessage = useCallback(() => {
    deleteMessage(selectedMessage);
  }, [deleteMessage, selectedMessage]);

  const handleSaveImage = () => {
    saveImage(message.message);
  };

  const menuOptions = useMemo(
    () => [
      {
        label: t('MESSAGES.FEEDBACK.DELETE_MESSAGE'),
        icon: <Trash2 />,
        onClick: handleDeleteMessage,
      },
    ],
    [handleDeleteMessage, t],
  );

  const imageOptions = useMemo(
    () => [
      {
        label: 'Save image',
        icon: <ImageDown />,
        onClick: handleSaveImage,
      },
    ],
    [handleSaveImage],
  );

  return (
    <ContextMenu open={open} onClose={handleClose} options={isImage ? imageOptions : menuOptions} />
  );
};

export default MessageBubbleMenu;
