import config from '../../../../config/default.json';
import { PhoneSettings } from '../useSettings';

describe('useSettings', () => {
  it('Creates settings and returns every needed key', () => {
    const invalid = {};
    const validated = new PhoneSettings(invalid, config.defaultSettings);
    for (const key of Object.keys(config.defaultSettings)) {
      expect(validated[key]).toBe(config.defaultSettings[key]);
    }
  });

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

  it('Creates settings and adds missing key for SettingOption', () => {
    const invalid = {};
    const validated = new PhoneSettings(invalid, {
      ...config.defaultSettings,
      ringtone: { label: 'Bye', value: 'bye' },
    });
    expect(validated.ringtone.label).toBe('Bye');
    expect(validated.ringtone.value).toBe('bye');
  });

  it('Creates settings and leave valid value as is for SettingOption', () => {
    const valid = { ringtone: { label: 'Test', value: 'test' } };
    const validated = new PhoneSettings(valid, {
      ...config.defaultSettings,
      ringtone: { label: 'Bye', value: 'bye' },
    });
    expect(validated.ringtone.label).toBe('Test');
    expect(validated.ringtone.value).toBe('test');
  });

  it('Creates settings and add default value when value typeof is not correct', () => {
    const invalid = { ringtone: 'test' };
    const validated = new PhoneSettings(invalid as any, {
      ...config.defaultSettings,
      ringtone: { label: 'Bye', value: 'bye' },
    });
    expect(validated.ringtone.label).toBe('Bye');
    expect(validated.ringtone.value).toBe('bye');
  });
});
