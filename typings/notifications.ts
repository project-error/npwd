export enum NotificationEvents {
  CREATE_NOTIFICATION = 'npwd:createNotification',
  REMOVE_NOTIFICATOIN = 'npwd:removeNotification',
}

export type NPWDNotification = {
  appId: string;
  secondaryTitle?: string;
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

export type CreateNotificationDTO = {
  appId: string;
  content: string;
  secondaryTitle: string;
  duration: number;
  keepOpen: boolean;
  path: string;
  notisId: string;
  onClick: () => void | null;
};
