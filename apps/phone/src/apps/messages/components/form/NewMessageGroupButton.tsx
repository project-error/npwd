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
  const checkedConversations = useCheckedConversationsValue();
  const [isEditing, setIsEditing] = useIsEditing();
  const { deleteConversation } = useMessageAPI();

  const handleDeleteConversations = () => {
    deleteConversation(checkedConversations);
    setIsEditing(false);
  };

  return (
    <button
      className="absolute bottom-10 right-5 flex items-center justify-center rounded-md p-2 bg-green-500 text-white hover:bg-green-600"
      color="primary"
      onClick={!isEditing ? onClick : handleDeleteConversations}
      onMouseUp={() => {
        toggleKeys(false);
      }}
    >
      {!isEditing ? <Add /> : <Delete />}
    </button>
  );
};

export default NewMessageGroupButton;
