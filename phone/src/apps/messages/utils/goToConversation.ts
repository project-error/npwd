import qs from 'qs';

export const goToConversation = (messageGroup, history) =>
  history.push(
    `/messages/conversations/${messageGroup.groupId}/?${qs.stringify(
      messageGroup
    )}`
  );
