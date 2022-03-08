interface TwitterConfig {
  showNotifications: boolean;
  generateProfileNameFromUsers: boolean;
  allowEditableProfileName: boolean;
  allowDeleteTweets: boolean;
  allowReportTweets: boolean;
  allowRetweet: boolean;
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
  level: 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
  enabled: boolean;
  sentryEnabled: true;
}

interface General {
  useDashNumber: boolean;
  useResourceIntegration: boolean;
  toggleKey: string;
  toggleCommand: string;
  defaultLanguage: string;
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
  identifierType: string;
  useIdentifierPrefix: boolean;
  profileQueries: boolean;
  phoneNumberColumn: string;
}

interface ImageSafety {
  filterUnsafeImageUrls: boolean;
  embedUnsafeImages: boolean;
  embedUrl: string;
  safeImageUrls: string[];
}

interface ImageConfig {
  url: string;
  type: string;
  imageEncoding: 'png' | 'jpg' | 'webp';
  contentType: string;
  authorizationPrefix: string;
  useAuthorization: boolean;
  returnedDataIndexes: Array<any>;
}

interface PhoneAsItemConfig {
  enabled: boolean;
  exportResource: string;
  exportFunction: string;
}

export interface ResourceConfig {
  database: DatabaseConfig;
  Locale: string;
  PhoneAsItem: PhoneAsItemConfig;
  RunRate: number;
  twitter: TwitterConfig;
  match: MatchConfig;
  bank: BankConfig;
  notificationPosition: NotificationConfig;
  general: General;
  debug: Debug;
  images: ImageConfig;
  imageSafety: ImageSafety;
}
