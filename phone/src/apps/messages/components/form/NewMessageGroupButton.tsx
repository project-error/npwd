import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Add, Delete } from '@mui/icons-material';
import { Fab } from '@mui/material';
import { useCheckedConversationsValue, useIsEditing } from '../../hooks/state';
import { fetchNui } from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { MessageEvents } from '@typings/messages';
import { useMessageActions } from '../../hooks/useMessageActions';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: theme.spacing(5),
    right: theme.spacing(3),
  },
}));

interface NewMessageGroupButtonProps {
  onClick(): void;
}

export const NewMessageGroupButton: React.FC<NewMessageGroupButtonProps> = ({ onClick }) => {
  const classes = useStyles();
  const checkedConversations = useCheckedConversationsValue();
  const [isEditing, setIsEditing] = useIsEditing();
  const { addAlert } = useSnackbar();
  const { removeConversation } = useMessageActions();
  const [t] = useTranslation();

  const deleteConversations = () => {
    fetchNui<ServerPromiseResp<void>>(MessageEvents.DELETE_CONVERSATION, {
      conversationsId: checkedConversations,
    }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('MESSAGES.DELETE_CONVERSATION_FAILED'),
          type: 'error',
        });
      }

      removeConversation(checkedConversations);
      setIsEditing(false);
    });
  };

  return (
    <Fab
      className={classes.root}
      color="primary"
      onClick={!isEditing ? onClick : deleteConversations}
    >
      {!isEditing ? <Add /> : <Delete />}
    </Fab>
  );
};

export default NewMessageGroupButton;
