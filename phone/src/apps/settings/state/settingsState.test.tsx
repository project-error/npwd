import { RecoilRoot } from 'recoil';
import { useSettingsValue } from '../hooks/useSettings';
import { renderHook } from '@testing-library/react-hooks';
import { NPWD_STORAGE_KEY } from '../utils/constants';
import config from '../../../config/default.json';
import { IPhoneSettings } from '@typings/settings';
import { waitFor } from '@testing-library/react';

const error = jest.fn();
beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve({}) });
  global.console.error = error;
});

describe('settingsStateManipulation', () => {
  jest.mock('@utils/fetchNui');
  const wrapper = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;

  test('settings set with invalid schema should be handled', async () => {
    const invalidSettingSchema = '{"invalid": "schema"}';
    window.localStorage.setItem(NPWD_STORAGE_KEY, invalidSettingSchema);

    localStorage.setItem(NPWD_STORAGE_KEY, invalidSettingSchema);

    const { result } = renderHook(() => useSettingsValue(), { wrapper });

    await waitFor(() => {
      expect(error).toHaveBeenCalled();
      expect(result.current).toEqual(config.defaultSettings);
    });
  });

  test('settings should be set properly', async () => {
    const changedSetting: IPhoneSettings = {
      ...config.defaultSettings,
      language: {
        label: 'Swedish',
        value: 'sv',
      },
      callVolume: 58,
    };

    window.localStorage.setItem(NPWD_STORAGE_KEY, JSON.stringify(changedSetting));

    const { result } = renderHook(() => useSettingsValue(), { wrapper });

    await waitFor(() => {
      expect(result.current).toEqual(changedSetting);
    });

    const storedSettingVal = JSON.parse(window.localStorage.getItem(NPWD_STORAGE_KEY));

    expect(storedSettingVal).toEqual(changedSetting);
  });
});
