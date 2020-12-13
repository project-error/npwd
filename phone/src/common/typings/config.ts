interface TwitterConfig {
  showNotifications: boolean;
  generateProfileNameFromUsers: boolean;
  allowEdtiableProfileName: boolean;
  allowDeleteTweets: boolean;
  allowReportTweets: boolean;
  characterLimit: number;
  enableAvatars: boolean;
  enableEmojis: boolean;
  enableImages: boolean;
  maxImages: number;
}

interface General {
  useDashNumber: boolean;
}

interface NotificationConfig {
  horizontal: 'left' | 'center' | 'right';
  vertical: 'bottom' | 'top';
}

interface BankConfig {
  showNotifications: boolean;
}

export interface ServerConfig {
  Locale: string;
  KeyTogglePhone: number;
  KeyTakeCall: number;
  PhoneAsItem: boolean;
  SwimDestroy: boolean;
  RunRate: number;
  DestoryChance: number;
  DestroyPhoneReCheck: number;
  twitter: TwitterConfig;
  bank: BankConfig;
  notificationPosition: NotificationConfig;
  general: General;
}
