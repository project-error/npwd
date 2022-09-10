export type NPWDNotification = {
  appId: string;
  content: HTMLElement | string;
  path?: string;
  onClick?: () => void;
  isRead: boolean;
  isActive: boolean;
  keepOpen: boolean;
  duration: number;
  id: string;
};

export type UnreadNotificationBarProps = {
  id: string;
  appId: string;
};
