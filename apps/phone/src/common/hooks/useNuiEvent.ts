import { MutableRefObject, useEffect, useRef } from 'react';
import LogDebugEvent from '@os/debug/LogDebugEvents';

interface NuiMessageData<T = unknown> {
  method: string;
  data: T;
  app: string;
}

type NuiHandlerSignature<T> = (data: T) => void;

/**
 * A hook that manage events listeners for receiving data from the client scripts
 * @param app
 * @param action The specific `action` that should be listened for.
 * @param handler The callback function that will handle data relayed by this hook
 *
 * @example
 * useNuiEvent<{visibility: true, wasVisible: 'something'}>('setVisible', (data) => {
 *   // whatever logic you want
 * })
 *
 **/

export const useNuiEvent = <T = any>(app: string, action: string, handler: (data: T) => void) => {
  const savedHandler: MutableRefObject<NuiHandlerSignature<T>> = useRef();

  // When handler value changes set mutable ref to handler val
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: MessageEvent<NuiMessageData<T>>) => {
      const { method: eventAction, app: tgtApp, data } = event.data;

      if (savedHandler.current && savedHandler.current.call) {
        if (eventAction === action && tgtApp === app) {
          LogDebugEvent({ action: eventAction, data });
          savedHandler.current(data);
        }
      }
    };

    window.addEventListener('message', eventListener);
    // Remove Event Listener on component cleanup
    return () => window.removeEventListener('message', eventListener);
  }, [action, app]);
};