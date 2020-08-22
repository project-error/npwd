import { createContext } from 'react';
import Default from '../default.json';
import { useConfig } from '../../../config/hooks/useConfig';

export const SettingsContext = createContext(Default);

export const useSettings = () => {
    return useConfig(SettingsContext);
};
