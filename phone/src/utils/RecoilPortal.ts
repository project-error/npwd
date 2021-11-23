import { RecoilValue, RecoilState, useRecoilCallback } from 'recoil';

interface Portal {
  get?: <T>(atom: RecoilValue<T>) => T;
  getPromise?: <T>(atom: RecoilValue<T>) => Promise<T>;
  set?: <T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)) => void;
  reset?: (atom: RecoilState<any>) => void;
}

const portal: Portal = {};

export default function RecoilPortal() {
  portal.get = useRecoilCallback<[atom: RecoilValue<any>], any>(
    ({ snapshot }) =>
      function <T>(atom: RecoilValue<T>) {
        return snapshot.getLoadable(atom).contents;
      },
    [],
  );

  portal.getPromise = useRecoilCallback<[atom: RecoilValue<any>], Promise<any>>(
    ({ snapshot }) =>
      function <T>(atom: RecoilValue<T>) {
        return snapshot.getPromise(atom);
      },
    [],
  );

  portal.set = useRecoilCallback(({ set }) => set, []);

  portal.reset = useRecoilCallback(({ reset }) => reset, []);

  return null;
}

export function getRecoil<T>(atom: RecoilValue<T>): T {
  return portal.get!(atom);
}

export function getRecoilPromise<T>(atom: RecoilValue<T>): Promise<T> {
  return portal.getPromise!(atom);
}

export function setRecoil<T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)) {
  portal.set!(atom, valOrUpdater);
}

export function resetRecoil(atom: RecoilState<any>) {
  portal.reset!(atom);
}
