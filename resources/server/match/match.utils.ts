import { mainLogger } from '../sv_logger';
import { FormattedMatch, FormattedProfile, Match, Profile } from '../../../typings/match';
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

export function formatMatches(match: Match): FormattedMatch | null {
  return {
    ...match,
    tagList: match.tags.split(',').filter((t) => t), // remove any empty tags
    lastActiveFormatted: dayjs.unix(match.lastActive).toString(),
    matchedAtFormatted: dayjs.unix(match.matchedAt).toString(),
  };
}
