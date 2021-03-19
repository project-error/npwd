import { FetchData } from '@sentry/tracing/dist/browser/request';
import { useCallback, useEffect, useRef, useState } from 'react';
import Nui, { IAbortableFetch } from '../utils/Nui';
import { eventNameFactory } from '../utils/nuiUtils';
import { useNuiEvent } from './useNuiEvent';

type UseNuiEventCallbackResponse<I, R> = [
  (d?: I) => void,
  { loading: boolean; error: any; response: R },
];

export const useNuiEventCallback = <I = FetchData, R = FetchData>(
  app: string,
  method: string,
  handler?: (res: R) => void,
  errHandler?: Function,
): UseNuiEventCallbackResponse<I, R> => {
  const fetchRef = useRef<IAbortableFetch>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  // These are Refs to avoid re renders.
  // We dont care if "app" and "method" arguments change.
  const eventNameRef = useRef<string>(eventNameFactory(app, method));
  const methodNameRef = useRef<string>(method);
  const appNameRef = useRef<string>(app);

  const [timedOut, setTimedOut] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [response, setResponse] = useState<R>(null);

  const onSuccess = useCallback(
    (data: R) => {
      if (!loading) {
        return;
      }
      // If we receive eventNameSuccess event, clear timeout
      timeoutRef.current && clearTimeout(timeoutRef.current);
      // If already timed out, don't do shit :)
      if (timedOut) {
        return;
      }
      // Set new state after success event received
      setResponse(data);
      setError(null);
      setLoading(false);
      handler?.(data);
    },
    [handler, timedOut, loading],
  );

  const onError = useCallback(
    (err: any) => {
      if (!loading) {
        return;
      }
      // If we receive eventNameSuccess event, clear timeout
      timeoutRef.current && clearTimeout(timeoutRef.current);
      // If already timed out, don't do shit :)
      if (timedOut) {
        return;
      }
      // Set new state after error event received
      setError(err);
      setResponse(null);
      setLoading(false);
      errHandler?.(err);
    },
    [errHandler, timedOut, loading],
  );

  // React to loading change and starting timeout timer.
  useEffect(() => {
    if (loading && !timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setTimedOut(true);
        onError(
          new Error(`${eventNameRef.current} NUI Event Callback timed out after 10000 seconds`),
        );
        fetchRef.current && fetchRef.current.abort();
        timeoutRef.current = undefined;
        fetchRef.current = undefined;
      }, 10000);
    }
  }, [loading, onError]);

  // Handle the success and error events for this method
  useNuiEvent(appNameRef.current, `${methodNameRef.current}Success`, onSuccess);
  useNuiEvent(appNameRef.current, `${methodNameRef.current}Error`, onError);

  // Only fetch if we are not loading/waiting the events.
  const fetch = useCallback((data?: I) => {
    setLoading((curr) => {
      if (!curr) {
        fetchRef.current = Nui.sendAbortable(methodNameRef.current, data);
        return true;
      }
      return curr;
    });
  }, []);

  return [fetch, { loading, response, error }];
};
