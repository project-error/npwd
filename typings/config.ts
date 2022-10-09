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

interface MarketplaceConfig {
  persistListings: boolean;
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
  showId: boolean;
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
  useContentType: boolean;
  useWebhook: boolean;
  authorizationHeader: string;
  authorizationPrefix: string;
  useAuthorization: boolean;
  returnedDataIndexes: Array<any>;
}

interface PhoneAsItemConfig {
  enabled: boolean;
  exportResource: string;
  exportFunction: string;
}

interface CustomNumberConfig {
  enabled: boolean;
  exportResource: string;
  exportFunction: string;
}

interface ProfanityFilter {
  enabled: boolean;
  badWords: string[];
}

interface VoiceMessageConfig {
  enabled: boolean;
  token: string;
  url: string;
  authorizationHeader: string;
  authorizationPrefix: string;
  returnedDataIndexes: Array<any>;
}

export interface ResourceConfig {
  database: DatabaseConfig;
  Locale: string;
  PhoneAsItem: PhoneAsItemConfig;
  customPhoneNumber: CustomNumberConfig;
  RunRate: number;
  twitter: TwitterConfig;
  match: MatchConfig;
  marketplace: MarketplaceConfig;
  bank: BankConfig;
  notificationPosition: NotificationConfig;
  general: General;
  debug: Debug;
  images: ImageConfig;
  imageSafety: ImageSafety;
  profanityFilter: ProfanityFilter;
  apps: string[];
  voiceMessage: VoiceMessageConfig;
}
