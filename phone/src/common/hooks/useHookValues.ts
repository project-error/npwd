import { useEffect, useRef } from 'react';
import { Path, UseFormSetValue } from 'react-hook-form';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

type FormState<T extends object> = Record<string, T>;
export const formState = atom({
  key: `hookValuesForm`,
  default: {},
});
const useValues = <T extends object>() => useRecoilValue<FormState<T>>(formState);
const useSetValues = <T extends object>() => useSetRecoilState<FormState<T>>(formState);

export enum EUseHookValues {
  'MARKETPLACE' = 'marketplaceForm',
}

export const useHookValues = <T extends object>(
  key: string,
  getValues?: () => T,
  setValue?: UseFormSetValue<T>,
) => {
  const updateOnce = useRef(false);
  const values = useValues<T>();
  const setValues = useSetValues<T>();

  const reset = () => {
    setValues((previousValues) => ({ ...previousValues, [key]: {} as T }));
  };

  /* When mounting component again, set values from store */
  useEffect(() => {
    const isEmpty = Object.keys(values[key] ?? {}).length === 0;
    if (updateOnce.current || isEmpty || !setValue) {
      return;
    }
    updateOnce.current = true;

    const vals = values[key];
    Object.keys(vals).forEach((key) => {
      setValue(key as Path<T>, vals[key]);
    });
  }, [key, setValue, values]);

  /* When unmounting component, save values in atom store w specified KEY */
  useEffect(() => {
    return () => {
      if (!getValues) {
        return;
      }

      const values = getValues();
      setValues((previousValues) => ({ ...previousValues, [key]: values }));
    };
  }, [getValues, key, setValues]);

  return { reset };
};
