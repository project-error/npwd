const ONE_MINUTE = 60;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

const JUST_NOW = 'TWITTER.TIME_JUST_NOW';
const MINUTES = 'TWITTER.TIME_MINUTES';
const HOURS = 'TWITTER.TIME_HOURS';
const DAYS = 'TWITTER.TIME_DAYS';

/**
 * Convert seconds to a human readable format i.e. "Just Now", "2m", "3d"
 * @param {function} t - translation object passed from a component implementing the hook
 * @param {number} seconds - seconds to translate to a string
 */
export function secondsToHumanReadable(t: (input: string) => string, seconds: number): string {
  if (seconds < 60) {
    return t(JUST_NOW);
  } else if (seconds < ONE_HOUR) {
    return `${Math.floor(seconds / ONE_MINUTE)}${t(MINUTES)}`;
  } else if (seconds < ONE_DAY) {
    return `${Math.floor(seconds / ONE_HOUR)}${t(HOURS)}`;
  } else {
    return `${Math.floor(seconds / ONE_DAY)}${t(DAYS)}`;
  }
}
