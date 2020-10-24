interface TwitterConfig {
  showNotifications: boolean;
  generateProfileNameFromUsers: boolean;
  characterLimit: number;
  allowEdtiableProfileName: boolean;
  allowDeleteTweets: boolean;
  enableAvatars: boolean;
  enableEmojis: boolean;
  enableImages: boolean;
  maxImages: number;
}

interface NotificationConfig {
  horizontal: "left" | "center" | "right";
  vertical: "bottom" | "top";
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
  notificationPosition: NotificationConfig;
}
