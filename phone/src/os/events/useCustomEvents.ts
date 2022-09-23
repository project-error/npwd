import { useEffect } from 'react';

export const useSubscription = <T = unknown>(event: string, handler: any) => {
  useEffect(() => {
    window.addEventListener(event, handler);
  });

  const unsubscribe = () => window.removeEventListener(event, handler);

  return {
    unsubscribe,
  };
};

export const useCustomEvent = <T = unknown>(event: string, outerPayload: T = {} as T) => {
  return function dispatch(innerPayload: T = {} as T) {
    const payload = Object.assign(outerPayload, innerPayload);

    window.dispatchEvent(
      new CustomEvent(event, {
        detail: payload,
      }),
    );
  };
};
