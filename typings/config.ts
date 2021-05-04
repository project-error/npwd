interface TwitterConfig {
  showNotifications: boolean;
  generateProfileNameFromUsers: boolean;
  allowEdtiableProfileName: boolean;
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
  allowEdtiableProfileName: boolean;
}
interface Debug {
  level: 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
  enabled: boolean;
}

interface General {
  useDashNumber: boolean;
  enableMultiChar: boolean;
}

interface NotificationConfig {
  horizontal: 'left' | 'center' | 'right';
  vertical: 'bottom' | 'top';
}

interface BankConfig {
  showNotifications: boolean;
}

interface DatabaseConfig {
  playerTable: string;
  identifierColumn: string;
}

export interface IServerConfig {
  database: DatabaseConfig;
  Locale: string;
  KeyTogglePhone: number;
  KeyTakeCall: number;
  PhoneAsItem: boolean;
  SwimDestroy: boolean;
  RunRate: number;
  DestoryChance: number;
  DestroyPhoneReCheck: number;
  twitter: TwitterConfig;
  match: MatchConfig;
  bank: BankConfig;
  notificationPosition: NotificationConfig;
  general: General;
  debug: Debug;
}
