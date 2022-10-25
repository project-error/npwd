import { atom, selector, useRecoilValue } from 'recoil';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { buildRespObj } from '@utils/misc';

// NPWD ocassionally can have a complex dependency graph in regards to async calls to the server
// In this example, we have an atom with name "example", with a async selector as the default value.

// In recoil, this means that the async selector will be immediately called upon the first 'get' attempt for the atoms state.
// The handler async function will execute only this one time, and once it resolves. This will never again be called until the atom is reset (NPWD will
// handle globally unloading all Recoil selectors and clearing their respective caches through the RecoilManager component when the
// character context changes)

// Since our selector returns a pending React suspense compatible promise, we need to utilize the Recoil.Suspense element
// in a component higher up in the component tree to correctly handle the promise pending state.

// tldr; THE SELECTOR WILL ONLY EVALUATE ONCE YOU FIRST REQUEST IT THROUGH a useRecoilState derived hook
export const exampleState = {
  example: atom<string | null>({
    key: 'exampleState',
    default: selector({
      key: 'exampleStateValue',
      get: async () => {
        // This fetchCall will initialize a request to the client scripts.
        // If this request is proxied using `useNuiProxy()` then the request will be sent to the server.
        // Through an event of the same name, (keep in mind that this is specifically a **PromiseEvent** and should
        // be handled using the onNetPromise function.
        try {
          const result = await fetchNui<ServerPromiseResp<string>>(
            // Target event name
            'MyExampleTargetEvent',
            // Data you wish to pass to client scripts or to proxy to the server
            { myPassedData: 'hi!' },
            // The third argument to fetchNui is the optional mockData argument. If the resource is currently
            // running in a browser, not within NUI, and is development mode. The mockdata argument will be resolved
            // instead of having to actually make a failing HTTP request.
            buildRespObj('myMockDataResponse'),
          );
          // The server responded with an error event, so we should handle.
          if (result.status !== 'ok') {
            console.error({ result });
          }

          //
          return result.data;
        } catch (e) {
          console.error(e);
          return '';
        }
      },
    }),
  }),
};

export const useExampleStringValue = () => useRecoilValue(exampleState.example);
