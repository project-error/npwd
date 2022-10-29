import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { settingsState, multiSettingsState } from '../state/settings.state';

export const useSettings = () => useRecoilState(multiSettingsState);
export const useSettingsValue = () => useRecoilValue(multiSettingsState);
export const useSetSettings = () => useSetRecoilState(multiSettingsState);

export const useResetSettings = () => useResetRecoilState(multiSettingsState);
