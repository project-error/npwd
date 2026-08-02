import React from 'react';
import { useCheckedConversationsValue, useIsEditing } from '../../hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { Button } from '@npwd/keyos';
import { Plus, Trash2 } from 'lucide-react';

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
    <Button
      className="absolute bottom-10 right-5 z-50 rounded-2xl bg-[color:var(--keyos-app-accent)] text-[color:var(--keyos-app-accent-foreground)] shadow-keyos-glow hover:brightness-110"
      onClick={!isEditing ? onClick : handleDeleteConversations}
      size="icon"
    >
      {!isEditing ? <Plus /> : <Trash2 />}
    </Button>
  );
};

export default NewMessageGroupButton;
