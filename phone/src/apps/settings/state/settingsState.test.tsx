import { RecoilRoot } from 'recoil';
import { useSettingsValue } from '../hooks/useSettings';
import { renderHook } from '@testing-library/react-hooks';
import { NPWD_STORAGE_KEY } from '../utils/constants';
import config from '../../../config/default.json';
import { IPhoneSettings } from '@typings/settings';

describe('settingsStateManipulation', () => {
  const wrapper = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;

  test('settings set with invalid schema should be handled', () => {
    const invalidSettingSchema = '{"invalid": "schema"}';
    window.localStorage.setItem(NPWD_STORAGE_KEY, invalidSettingSchema);

    jest.spyOn(console, 'error').mockImplementation(() => {});

    localStorage.setItem(NPWD_STORAGE_KEY, invalidSettingSchema);

    const { result } = renderHook(() => useSettingsValue(), { wrapper });
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Schema was invalid'));
    expect(result.current).toEqual(config.defaultSettings);
  });

  test('settings should be set properly', () => {
    const changedSetting: IPhoneSettings = {
      ...config.defaultSettings,
      language: {
        label: 'Swedish',
        value: 'sv',
      },
      callVolume: 58,
      ringtoneVol: 12,
    };

    window.localStorage.setItem(NPWD_STORAGE_KEY, JSON.stringify(changedSetting));

    const { result } = renderHook(() => useSettingsValue(), { wrapper });

    expect(result.current).toEqual(changedSetting);

    const storedSettingVal = JSON.parse(window.localStorage.getItem(NPWD_STORAGE_KEY));

    expect(storedSettingVal).toEqual(changedSetting);
  });
});
