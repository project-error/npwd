import { mainLogger } from '../sv_logger';
import { FormattedProfile, Profile } from '../../../typings/match';
import dayjs from 'dayjs';

export const matchLogger = mainLogger.child({ module: 'match' });

export function formatProfile(profile: Profile): FormattedProfile | null {
  return {
    ...profile,
    tagList: profile.tags.split(',').filter((t) => t), // remove any empty tags
    lastActiveFormatted: dayjs.unix(profile.lastActive).toString(),
    viewed: false,
  };
}
