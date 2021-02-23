import { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { atom, useSetRecoilState, useRecoilValue } from 'recoil';
import { usePhone } from '../../phone/hooks/usePhone';

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
  const history = useHistory();
  const { closePhone } = usePhone();
  const getters = {
    ArrowRight: useRecoilValue(keyboardState.ArrowRight),
    ArrowLeft: useRecoilValue(keyboardState.ArrowLeft),
    ArrowUp: useRecoilValue(keyboardState.ArrowUp),
    ArrowDown: useRecoilValue(keyboardState.ArrowDown),
    Backspace: useRecoilValue(keyboardState.Backspace),
    Enter: useRecoilValue(keyboardState.Enter),
    Escape: useRecoilValue(keyboardState.Escape),
  };

  const handlers = useRef(new Map());
  const setEscape = useSetRecoilState<any>(keyboardState.Escape);
  const setBackspace = useSetRecoilState(keyboardState.Backspace);

  useEffect(
    function registerCustomKeys() {
      Object.keys(getters).forEach((g) => {
        handlers.current.set(g, getters[g]);
      });
    },
    [getters]
  );

  useEffect(
    function handleNUIKeyboardMessage() {
      function onKeyUp(event) {
        const { key } = event;
        const callback = handlers.current.get(key);
        if (isKeyValid(key) && callback && callback.call) {
          return callback(event);
        }
      }

      window.addEventListener('keyup', onKeyUp);
      return () => window.removeEventListener('keyup', onKeyUp);
    },
    [getters]
  );

  const backspaceHandler = useCallback(
    (event) => {
      if (['input', 'textarea'].includes(event.target.nodeName.toLowerCase())) {
        // Dont anything if we are typing something :)
        return;
      }
      history.goBack();
    },
    [history]
  );

  useEffect(
    function registerDefaultHandlers() {
      handlers.current.set('Escape', () => closePhone());
      handlers.current.set('Backspace', backspaceHandler);
    },
    [setEscape, setBackspace, history, backspaceHandler, closePhone]
  );
};
