import { useSetMessageConversation } from './state';
import { useCallback } from 'react';

interface MessageActionProps {
  removeConversation: (conversationId: string) => void;
}

export const useMessageActions = (): MessageActionProps => {
  const setMessageConversation = useSetMessageConversation();

  const removeConversation = useCallback(
    (conversationId: string) => {
      setMessageConversation((curVal) =>
        [...curVal].filter((conversation) => conversation.conversation_id !== conversationId),
      );
    },
    [setMessageConversation],
  );

  return {
    removeConversation,
  };
};
