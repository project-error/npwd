export const isEnvBrowser = (): boolean =>
  !(window as unknown as { invokeNative: CallableFunction }).invokeNative;
