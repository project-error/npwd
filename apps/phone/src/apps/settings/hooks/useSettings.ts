import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { settingsState } from '../state/settings.state';

export const useSettings = () => useRecoilState(settingsState);
export const useSettingsValue = () => useRecoilValue(settingsState);
export const useSetSettings = () => useSetRecoilState(settingsState);

export const useResetSettings = () => useResetRecoilState(settingsState);
