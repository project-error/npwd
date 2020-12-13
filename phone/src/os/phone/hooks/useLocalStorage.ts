import { useState } from 'react';

// TODO: Integrate debug log to fetch when that branch is merged

/**
 * A LocalStorage hook designed to behave like the useState hook.
 * @param {string} key - The unique identifier to be used as a key
 * @param {string} intialValue - The initialValue to be used
 * if there is no savedState
 */

function useLocalStorage<T>(key: string, initialValue: T) {
  // Serves as a nice identifying prefix for the key
  const UNIQ_PREFIX = 'npwd_phone_';
  const [localVal, setLocalVal] = useState<T>(() => {
    try {
      const data = window.localStorage.getItem(UNIQ_PREFIX + key);
      // return stored or initValue if none stored
      return data ? JSON.parse(data) : initialValue;
    } catch (e) {
      // TODO: Integrate debug error state here
      console.log(e);
      // We still return initVal if error is thrown
      return initialValue;
    }
  });

  // Trying to rep useState setter pretty close just with localStorage
  const setVal = (value: T | ((val: T) => T)) => {
    try {
      // Same API as useState meaning we can accept a function for value
      const valForStore = value instanceof Function ? value(localVal) : value;
      // Save that state so we repli useState
      setLocalVal(valForStore);
      // Set that localStorage yo
      window.localStorage.setItem(
        UNIQ_PREFIX + key,
        JSON.stringify(valForStore)
      );
    } catch (e) {
      // TODO: Also integrate debug log state error here
      console.log(e);
    }
  };

  return [localVal, setVal];
}

export default useLocalStorage;
