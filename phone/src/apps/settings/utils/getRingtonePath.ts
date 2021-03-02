export const getRingtonePath = (name?: string) => `./media/ringtones/${name || 'pixel'}.ogg`;

export const getNotificationPath = (name?: string) =>
  `./media/notifications/${name || 'online'}.ogg`;
