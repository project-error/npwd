import { IPhoneSettings } from '../../../apps/settings/hooks/useSettings';
import { getNotificationPath, getRingtonePath } from '../../../apps/settings/utils/getRingtonePath';

const getPath = {
  ringtone: getRingtonePath,
  notiSound: getNotificationPath,
};

/**
 * Gets the configuration for SoundProvider based on settings and apps
 */
export const getSoundSettings = (
  type: 'ringtone' | 'notiSound',
  settings: IPhoneSettings,
  app?: string,
) => {
  try {
    return app
      ? {
          sound: getPath[type](settings[`${app}_${type}`].value || settings[type].value),
          volume: (settings[`${app}_${type}Vol`] || settings[`${type}Vol`]) / 100,
        }
      : {
          sound: getPath[type](settings[type as string].value),
          volume: settings[`${type}Vol`] / 100,
        };
  } catch (e) {
    console.error('getSoundSettings.ts error', e, 'Using default sounds');
    return { sound: getPath[type](), volume: 0 };
  }
};
