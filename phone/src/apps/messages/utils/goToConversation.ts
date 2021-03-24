import { MessageEvents } from '../../../../../typings/messages';
import Nui from '../../../os/nui-events/utils/Nui';

export const goToConversation = (messageGroup, history) => {
  if (!messageGroup?.groupId || !history) return;
  history.push(`/messages/conversations/${messageGroup.groupId}`);
  Nui.send(MessageEvents.FETCH_MESSAGES, { groupId: messageGroup.groupId });
};
