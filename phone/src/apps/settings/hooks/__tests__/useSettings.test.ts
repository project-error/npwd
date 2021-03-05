import { RecoilRoot } from 'recoil';
import config from '../../../../config/default.json';
import { PhoneSettings } from '../useSettings';

describe('useSettings', () => {
  it('Creates settings and adds missing key', () => {
    const invalid = {};
    const validated = new PhoneSettings(invalid, { ...config.defaultSettings, ringtoneVol: 2 });
    expect(validated.ringtoneVol).toBe(2);
  });

  it('Creates settings and leave valid value as is', () => {
    const valid = { ringtoneVol: 0 };
    const validated = new PhoneSettings(valid, { ...config.defaultSettings, ringtoneVol: 50 });
    expect(validated.ringtoneVol).toBe(0);
  });

  it('Creates settings and adds missing key for PhoneSetting', () => {
    const invalid = {};
    const validated = new PhoneSettings(invalid, {
      ...config.defaultSettings,
      ringtone: { label: 'Bye', value: 'bye' },
    });
    expect(validated.ringtone.label).toBe('Bye');
    expect(validated.ringtone.value).toBe('bye');
  });

  it('Creates settings and leave valid value as is for PhoneSetting', () => {
    const valid = { ringtone: { label: 'Test', value: 'test' } };
    const validated = new PhoneSettings(valid, {
      ...config.defaultSettings,
      ringtone: { label: 'Bye', value: 'bye' },
    });
    expect(validated.ringtone.label).toBe('Test');
    expect(validated.ringtone.value).toBe('test');
  });
});
