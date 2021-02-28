import { IPhoneSettings } from '../../../apps/settings/hooks/useSettings';
import {
  getNotificationPath,
  getRingtonePath,
} from '../../../apps/settings/utils/getRingtonePath';

const getPath = {
  ringtone: getRingtonePath,
  notification: getNotificationPath,
};

/**
 * Gets the configuration for SoundProvider based on settings and apps
 */
export const getSoundSettings = (
  type: 'ringtone' | 'notification',
  settings: IPhoneSettings,
  app?: string
) => {
  try {
    return app
      ? {
          sound: getPath[type](settings[`${app}_${type}`]),
          volume: settings[`${app}_${type}Vol`] / 100,
        }
      : {
          sound: getPath[type](settings[type]),
          volume: settings[`${type}Vol`] / 100,
        };
  } catch (e) {
    console.error('getSoundSettings.ts error', e, 'Using default sounds');
    return { sound: getPath[type](), volume: 1 };
  }
};
