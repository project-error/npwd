/**
 * Simple wrapper around fetch API tailored for CEF/NUI use.
 * @param eventName - The endpoint eventname to target
 * @param data - Data you wish to send in the NUI Callback
 *
 * @return returnData - A promise for the data sent back by the NuiCallbacks CB argument
 */
import { ServerPromiseResp } from '@typings/common';
import LogDebugEvent from '../os/debug/LogDebugEvents';
import { isEnvBrowser } from './misc';

async function fetchNui<T = any, D = any>(
  eventName: string,
  data?: D,
  mockResp?: T,
): Promise<T | undefined> {
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  };

  if (isEnvBrowser() && mockResp) {
    LogDebugEvent({
      data: {
        request: data,
        response: mockResp,
      },
      action: `fetchNui (${eventName})`,
    });
    return mockResp;
  }

  const resourceName = (window as any).GetParentResourceName
    ? (window as any).GetParentResourceName()
    : 'npwd';

  const resp = await fetch(`https://${resourceName}/${eventName}`, options);

  const responseObj: ServerPromiseResp<T> = await resp.json();

  LogDebugEvent({
    data: {
      request: data,
      response: responseObj,
    },
    action: `fetchNui (${eventName})`,
  });

  if (responseObj.status !== 'ok') {
    throw new Error(responseObj.errorMsg);
  }

  return responseObj.data;
}

export default fetchNui;
