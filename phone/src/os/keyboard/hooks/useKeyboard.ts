import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { atom, useSetRecoilState, useRecoilValue } from 'recoil';
import Nui from '../../nui-events/utils/Nui';

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
  const setBackspace = useSetRecoilState(keyboardState.Backspace);

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
          return callback.handler(event);
        }
      }

      window.addEventListener('keyup', onKeyUp);
      return () => window.removeEventListener('keyup', onKeyUp);
    },
    [getters]
  );

  const escapeHandler = useCallback(() => Nui.send('phone:close'), []);

  const backspaceHandler = useCallback((event) => {
    if (['input', 'textarea'].includes(event.target.nodeName.toLowerCase())) {
      // Dont anything if we are typing something :)
      return;
    }
    history.goBack();
  }, [history]);

  useEffect(
    function registerDefaultHandlers() {
      setEscape({ handler: escapeHandler });
      setBackspace({ handler: backspaceHandler });
    },
    [setEscape, setBackspace, history, escapeHandler, backspaceHandler]
  );
};

export const useKeyboard = () => {
  const setters = {
    ArrowRight: useSetRecoilState(keyboardState.ArrowRight),
    ArrowLeft: useSetRecoilState(keyboardState.ArrowLeft),
    ArrowUp: useSetRecoilState(keyboardState.ArrowUp),
    ArrowDown: useSetRecoilState(keyboardState.ArrowDown),
    Enter: useSetRecoilState(keyboardState.Enter),
  };

  return (key, handler) => {
    setters[key]({ handler });
  };
};
