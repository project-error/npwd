interface TwitterConfig {
  showNotifications: boolean;
  generateProfileNameFromUsers: boolean;
  allowEditableProfileName: boolean;
  allowDeleteTweets: boolean;
  allowReportTweets: boolean;
  characterLimit: number;
  newLineLimit: number;
  enableAvatars: boolean;
  enableEmojis: boolean;
  enableImages: boolean;
  maxImages: number;
}

interface MatchConfig {
  generateProfileNameFromUsers: boolean;
  allowEditableProfileName: boolean;
}
interface Debug {
  level: 'error' | 'warn' | 'info' | 'verbose' | 'debug';
  enabled: boolean;
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

export interface ResourceConfig {
  Locale: string;
  KeyTogglePhone: number;
  KeyTakeCall: number;
  PhoneAsItem: boolean;
  SwimDestroy: boolean;
  RunRate: number;
  twitter: TwitterConfig;
  match: MatchConfig;
  bank: BankConfig;
  notificationPosition: NotificationConfig;
  general: General;
  debug: Debug;
}
