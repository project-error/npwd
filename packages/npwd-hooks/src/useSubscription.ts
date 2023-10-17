export const useSubscription = <T = unknown>(event: string, handler: any) => {
  window.addEventListener(event, handler);

  const unsubscribe = () => window.removeEventListener(event, handler);

  return {
    unsubscribe,
  };
};
