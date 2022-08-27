import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Add, Delete } from '@mui/icons-material';
import { Fab } from '@mui/material';
import { useCheckedConversationsValue, useIsEditing } from '../../hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { toggleKeys } from '@ui/components';

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
  const { deleteConversation } = useMessageAPI();

  const handleDeleteConversations = () => {
    deleteConversation(checkedConversations);
    setIsEditing(false);
  };

  return (
    <Fab
      className={classes.root}
      color="primary"
      onClick={!isEditing ? onClick : handleDeleteConversations}
      onMouseUp={() => {toggleKeys(false);}}
    >
      {!isEditing ? <Add /> : <Delete />}
    </Fab>
  );
};

export default NewMessageGroupButton;
