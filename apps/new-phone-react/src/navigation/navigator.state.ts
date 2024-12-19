import { atom, useAtomValue, useSetAtom } from "jotai";
import { AppRoute } from "./navigator";

const navigatorAtom = atom<AppRoute[]>([]);

export const rwNavigatorAtom = atom((get) => get(navigatorAtom), (get, set, update: AppRoute) => {
    const current = get(navigatorAtom);
    if (current.find((route) => route.path === update.path)) {
        return;
    }

    set(navigatorAtom, [...current, update]);
});

export const useSetNavigator = () => useSetAtom(rwNavigatorAtom);
export const useNavigators = () => useAtomValue(rwNavigatorAtom);