// Quickly determine whether we are in browser
export const isEnvBrowser = (): boolean =>
  process.env.NODE_ENV === 'development' && !(window as any).invokeNative;
