// Quickly determine whether we are in browser
import { ServerPromiseResp } from '@typings/common';

export const isEnvBrowser = (): boolean => import.meta.env.DEV && !(window as any).invokeNative;

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

export const initials = (fullName: string) => {
  // Create a array from fullName
  if (!fullName) return 'X';

  const arrName = fullName.split(' ');

  // Select the first letter of the name
  const iniName = fullName.charAt(0);

  // Select the first letter of the lastname
  const iniLname = arrName[arrName.length - 1].charAt(0);

  // Return the initials
  return `${iniName}${arrName.length > 1 ? iniLname : ''}`;
};
