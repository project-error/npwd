import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Fab } from '@mui/material';
import { useCheckedConversationsValue, useIsEditingValue } from '../../hooks/state';
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

interface INewMessageGroupButtonProps {
  onClick(): void;
}

export function NewMessageGroupButton({ onClick }: INewMessageGroupButtonProps) {
  const classes = useStyles();
  const checkedConversations = useCheckedConversationsValue();
  const isEditing = useIsEditingValue();
  const { addAlert } = useSnackbar();
  const { removeConversation } = useMessageActions();
  const [t] = useTranslation();

  const deleteConversations = () => {
    fetchNui<ServerPromiseResp<void>>(MessageEvents.DELETE_CONVERSATION, {
      conversationsId: checkedConversations,
    }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('APPS_MESSAGES_DELETE_CONVERSATION_FAILED'),
          type: 'error',
        });
      }

      removeConversation(checkedConversations);
    });
  };

  return (
    <Fab
      className={classes.root}
      color="primary"
      onClick={!isEditing ? onClick : deleteConversations}
    >
      {!isEditing ? <AddIcon /> : <DeleteIcon />}
    </Fab>
  );
}

export default NewMessageGroupButton;
