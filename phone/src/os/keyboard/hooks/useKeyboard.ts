import { useCallback, useEffect, useMemo } from 'react';
import { atom, useSetRecoilState, useRecoilValue } from 'recoil';

const keyboardState = {
  ArrowRight: atom({
    key: 'ArrowRight',
    default: null,
  }),
  ArrowLeft: atom({
    key: 'ArrowLeft',
    default: null,
  }),
  ArrowUp: atom({
    key: 'ArrowUp',
    default: null,
  }),
  ArrowDown: atom({
    key: 'ArrowDown',
    default: null,
  }),
  Backspace: atom({
    key: 'Backspace',
    default: null,
  }),
  Enter: atom({
    key: 'Enter',
    default: null,
  }),
  Escape: atom({
    key: 'Escape',
    default: null,
  }),
};

const validKeys = [
  'ArrowRight',
  'ArrowLeft',
  'ArrowUp',
  'ArrowDown',
  'Backspace',
  'Enter',
  'Escape',
];

const isKeyValid = (key) => validKeys.indexOf(key) !== -1;

export const useInitKeyboard = () => {
  const getters = {
    ArrowRight: useRecoilValue(keyboardState.ArrowRight),
    ArrowLeft: useRecoilValue(keyboardState.ArrowLeft),
    ArrowUp: useRecoilValue(keyboardState.ArrowUp),
    ArrowDown: useRecoilValue(keyboardState.ArrowDown),
    Backspace: useRecoilValue(keyboardState.Backspace),
    Enter: useRecoilValue(keyboardState.Enter),
    Escape: useRecoilValue(keyboardState.Escape),
  };

  const setEscape = useSetRecoilState<any>(keyboardState.Escape);

  useEffect(
    function handleNUIKeyboardMessage() {
      function onKeyUp(event) {
        const { key } = event;
        const callback = getters[key];
        if (
          isKeyValid(key) &&
          callback &&
          callback.handler &&
          callback.handler.call
        ) {
          return callback.handler();
        }
      }

      window.addEventListener('keyup', onKeyUp);
      return () => window.removeEventListener('keyup', onKeyUp);
    },
    [getters]
  );

  useEffect(
    function registerEscapeHandler() {
      setEscape({ handler: () => console.log('close phone') });
    },
    [setEscape]
  );
};

export const useKeyboard = () => {
  const ArrowRight = useSetRecoilState(keyboardState.ArrowRight);
  const ArrowLeft = useSetRecoilState(keyboardState.ArrowLeft);
  const ArrowUp = useSetRecoilState(keyboardState.ArrowUp);
  const ArrowDown = useSetRecoilState(keyboardState.ArrowDown);
  const Backspace = useSetRecoilState(keyboardState.Backspace);
  const Enter = useSetRecoilState(keyboardState.Enter);

  const setters = useMemo(
    () => ({
      ArrowRight,
      ArrowLeft,
      ArrowUp,
      ArrowDown,
      Backspace,
      Enter,
    }),
    [ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Backspace, Enter]
  );

  return useCallback(
    (key, handler) => {
      setters[key]({ handler });
    },
    [setters]
  );
};
