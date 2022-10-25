// Quickly determine whether we are in browser
import { ServerPromiseResp } from '@typings/common';

export const isEnvBrowser = (): boolean =>
  process.env.NODE_ENV === 'development' && !(window as any).invokeNative;

export const getResourceName = () =>
  (window as any).GetParentResourceName ? (window as any)?.GetParentResourceName() : 'npwd';

export const buildRespObj = (
  data: any,
  status?: 'ok' | 'error',
  errorMsg?: string,
): ServerPromiseResp<any> => ({
  data,
  status,
  errorMsg,
});
