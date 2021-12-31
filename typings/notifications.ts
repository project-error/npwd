export enum NotificationEvents {
  SET_NOTIFICATION_INACTIVE = 'npwd:setNotiInactive',
  SET_ALL_NOTIFICATIONS_INACTIVE = 'npwd:setAllNotiInactive',
  MARK_NOTIFICATION_AS_READ = 'npwd:markNotiAsRead',
  CLEAR_NOTIFICATIONS = 'npwd:clearNoti',
  QUEUE_NOTIFICATION = 'npwd:queueNoti',
}

export interface NPWDNotification extends QueueNotificationOptsReadonly {
  isActive: boolean;
  isRead: boolean;
  timeReceived: Date;
}

export type QueueNotificationOptsReadonly = Readonly<QueueNotificationBase>;

export interface QueueNotificationBase {
  appId: string;
  duration?: number;
  message: string;
  path?: string;
  persist?: boolean;
  uniqId: string;
}

export interface UnreadNotification {
  uniqId: string;
  appId: string;
  icon: JSX.Element;
  notificationIcon: JSX.Element;
  message: string;
  path: string;
  onClick?: () => void;
}

export interface UseNotificationVal {
  createNotification: (opts: QueueNotificationOptsReadonly) => void;
  removeAllActive: () => void;
  removeActive: (key: string) => void;
  markAsRead: (key: string) => void;
  clearAllNotifications: () => void;
}
