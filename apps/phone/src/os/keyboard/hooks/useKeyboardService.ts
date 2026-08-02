import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { usePhone } from '@os/phone/hooks/usePhone';
import { useCall } from '@os/call/hooks/useCall';

const keyboardState = {
  ArrowRight: atom(null),
  ArrowLeft: atom(null),
  ArrowUp: atom(null),
  ArrowDown: atom(null),
  Backspace: atom(null),
  Enter: atom(null),
  Escape: atom(null),
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
  const navigate = useNavigate();
  const { closePhone } = usePhone();
  const { call } = useCall();

  const ArrowRight = useAtomValue(keyboardState.ArrowRight);
  const ArrowLeft = useAtomValue(keyboardState.ArrowLeft);
  const ArrowUp = useAtomValue(keyboardState.ArrowUp);
  const ArrowDown = useAtomValue(keyboardState.ArrowDown);
  const Backspace = useAtomValue(keyboardState.Backspace);
  const Enter = useAtomValue(keyboardState.Enter);
  const Escape = useAtomValue(keyboardState.Escape);

  const handlers = useRef(new Map());
  const setEscape = useSetAtom(keyboardState.Escape);
  const setBackspace = useSetAtom(keyboardState.Backspace);

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

  useEffect(function handleNUIKeyboardPress() {
    function onKeyDown(event) {
      const { key } = event;
      if (key === 'Tab') {
        event.preventDefault();
        return;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const backspaceHandler = useCallback(
    (event) => {
      if (['input', 'textarea'].includes(event.target.nodeName.toLowerCase()) || call) {
        // Dont do anything if we are typing something, or if we're in a call :)
        return;
      }
      navigate(-1);
    },
    [navigate, call],
  );

  const closePhoneHandler = (event) => {
    if (['input', 'textarea'].includes(event.target.nodeName.toLowerCase())) {
      event.target.blur();
    }
    closePhone();
  };

  useEffect(
    function registerDefaultHandlers() {
      handlers.current.set('Escape', closePhoneHandler);
      handlers.current.set('Backspace', backspaceHandler);
    },
    [setEscape, setBackspace, backspaceHandler, closePhone],
  );
};
