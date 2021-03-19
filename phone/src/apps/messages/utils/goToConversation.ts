import Nui from '../../../os/nui-events/utils/Nui';

export const goToConversation = (messageGroup, history) => {
  if (!messageGroup?.groupId || !history) return;
  history.push(`/messages/conversations/${messageGroup.groupId}`);
  Nui.send('phone:fetchMessages', { groupId: messageGroup.groupId });
};
