import { atom, useAtomValue, useSetAtom } from 'jotai';

const isNavigationDisabled = atom(false);

export const useSetNavigationDisabled = () => useSetAtom(isNavigationDisabled);
export const useNavigationDisabledValue = () => useAtomValue(isNavigationDisabled);
