/**
 * Find all participants except the source;
 * @param conversationList
 * @param phoneNumber
 */
export const findParticipants = (conversationList: string, phoneNumber: string) => {
  return conversationList.split('+').filter((participant) => participant !== phoneNumber);
};
