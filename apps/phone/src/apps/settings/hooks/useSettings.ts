import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { resetSettingsAtom, settingsState } from '../state/settings.state';

export const useSettings = () => useAtom(settingsState);
export const useSettingsValue = () => useAtomValue(settingsState);
export const useSetSettings = () => useSetAtom(settingsState);

export const useResetSettings = () => useSetAtom(resetSettingsAtom);
