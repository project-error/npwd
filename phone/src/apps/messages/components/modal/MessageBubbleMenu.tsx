import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMessageActions } from '../../hooks/useMessageActions';
import { fetchNui } from '../../../../utils/fetchNui';
import { MessageEvents } from '../../../../../../typings/messages';
import { ServerPromiseResp } from '../../../../../../typings/common';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { ContextMenu } from '../../../../ui/components/ContextMenu';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';
import { useSelectedMessageValue } from '../../hooks/state';

interface MessageBubbleMenuProps {
  open: boolean;
  handleClose: () => void;
}

const MessageBubbleMenu: React.FC<MessageBubbleMenuProps> = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const { deleteMessage } = useMessageActions();
  const { addAlert } = useSnackbar();
  const selectedMessage = useSelectedMessageValue();

  const handleDeleteMessage = useCallback(() => {
    fetchNui<ServerPromiseResp<any>>(MessageEvents.DELETE_MESSAGE, selectedMessage).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('APPS_MESSAGES_DELETE_MESSAGE_FAILED'),
          type: 'error',
        });
      }

      deleteMessage(selectedMessage.id);
    });
  }, [deleteMessage, t, addAlert, selectedMessage]);

  const menuOptions = useMemo(
    () => [
      {
        label: t('APPS_MESSAGE_DELETE_MESSAGE'),
        icon: <PhotoLibraryIcon />,
        onClick: handleDeleteMessage,
      },
    ],
    [handleDeleteMessage, t],
  );

  return <ContextMenu open={open} onClose={handleClose} options={menuOptions} />;
};

export default MessageBubbleMenu;
