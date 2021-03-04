export const goToConversation = (messageGroup, history) =>
  history.push(`/messages/conversations/${messageGroup.groupId}`);
