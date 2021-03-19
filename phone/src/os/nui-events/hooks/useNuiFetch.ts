import { useCallback, useRef, useState } from 'react';

interface IAbortableFetch {
  abort: () => void;
  ready: Promise<Response>;
}

function abortableFetch(request, opts): IAbortableFetch {
  const controller = new AbortController();
  const signal = controller.signal;

  return {
    abort: () => controller.abort(),
    ready: fetch(request, { ...opts, signal }),
  };
}

export type FetchData = Record<string, any> | boolean | null | undefined | string | number;

type UseNuiFetchResponse<I, R> = [
  (data?: I) => void,
  { response: R; error: Error | unknown; loading: boolean },
];

const DEFAULT_HANDLER = () => {};

export function useNuiFetch<I = FetchData, R = FetchData>(
  event: string,
  handler: (d?: R) => void = DEFAULT_HANDLER,
): UseNuiFetchResponse<I, R> {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | unknown>(null);
  const [response, setResponse] = useState<R>(null);
  const fetching = useRef<IAbortableFetch>();

  const onFetch = useCallback(
    (input?: I): Promise<R> => {
      return new Promise((resolve, reject) => {
        setLoading(true);
        try {
          if (fetching.current && fetching.current.abort) {
            fetching.current.abort();
            fetching.current = undefined;
            setError(null);
            setResponse(null);
          }
          const body = JSON.stringify(input);
          const opt = {
            method: 'post',
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
            },
            body,
          };
          const req = abortableFetch(`https://new-phone-who-dis/${event}`, opt);
          fetching.current = req;
          req.ready
            .then((r) => {
              const res = r.json() as unknown;
              setResponse(res as R);
              handler?.(res as R);
              resolve(res as R);
              setError(null);
            })
            .catch((e) => {
              setError(e);
              setResponse(null);
              reject(e);
            })
            .finally(() => {
              setLoading(false);
            });
        } catch (e) {
          setLoading(false);
          setError(e);
          setResponse(null);
          reject(e);
        }
      });
    },
    [event, handler],
  );

  return [onFetch, { error, response, loading }];
}
