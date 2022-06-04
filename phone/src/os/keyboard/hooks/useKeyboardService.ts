import { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { atom, useSetRecoilState, useRecoilValue } from 'recoil';
import { usePhone } from '@os/phone/hooks/usePhone';
import { useCall } from '@os/call/hooks/useCall';

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

export const useKeyboardService = () => {
  const history = useHistory();
  const { closePhone } = usePhone();
  const { call } = useCall();

  const ArrowRight = useRecoilValue(keyboardState.ArrowRight);
  const ArrowLeft = useRecoilValue(keyboardState.ArrowLeft);
  const ArrowUp = useRecoilValue(keyboardState.ArrowUp);
  const ArrowDown = useRecoilValue(keyboardState.ArrowDown);
  const Backspace = useRecoilValue(keyboardState.Backspace);
  const Enter = useRecoilValue(keyboardState.Enter);
  const Escape = useRecoilValue(keyboardState.Escape);

  const handlers = useRef(new Map());
  const setEscape = useSetRecoilState<any>(keyboardState.Escape);
  const setBackspace = useSetRecoilState(keyboardState.Backspace);

  useEffect(
    function registerCustomKeys() {
      handlers.current.set('ArrowRight', ArrowRight);
      handlers.current.set('ArrowLeft', ArrowLeft);
      handlers.current.set('ArrowUp', ArrowUp);
      handlers.current.set('ArrowDown', ArrowDown);
      handlers.current.set('Backspace', Backspace);
      handlers.current.set('Enter', Enter);
      handlers.current.set('Escape', Escape);
    },
    [ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Backspace, Enter, Escape],
  );

  useEffect(function handleNUIKeyboardMessage() {
    function onKeyUp(event) {
      const { key } = event;
      const callback = handlers.current.get(key);
      if (isKeyValid(key) && callback && callback.call) {
        return callback(event);
      }
    }

    window.addEventListener('keyup', onKeyUp);
    return () => window.removeEventListener('keyup', onKeyUp);
  }, []);

  const backspaceHandler = useCallback(
    (event) => {
      if (['input', 'textarea', 'div'].includes(event.target.nodeName.toLowerCase()) || call) {
        // Dont anything if we are typing something, or if we're in a call :)
        return;
      }
      history.goBack();
    },
    [history, call],
  );

  useEffect(
    function registerDefaultHandlers() {
      handlers.current.set('Escape', () => closePhone());
      handlers.current.set('Backspace', backspaceHandler);
    },
    [setEscape, setBackspace, history, backspaceHandler, closePhone],
  );
};
