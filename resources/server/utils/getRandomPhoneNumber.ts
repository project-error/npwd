import { config } from '../server';

export function getRandomPhoneNumber() {
  if (!config.general.useDashNumber) {
    return Math.floor(Math.random() * 10000000).toString(); // 10000000 creates a number with 7 characters.
  }

  return Math.floor(Math.random() * 10000000)
    .toString()
    .replace(/(\d{3})(\d{4})/, '$1-$2');
  // The numbers inside {} in replace() can be changed to how many digits you want on each side of the dash.
  // Example: 123-4567
}
