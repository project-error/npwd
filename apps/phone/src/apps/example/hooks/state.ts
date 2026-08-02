import { buildRespObj } from '@utils/misc';
import { fetchNuiData } from '@common/query/fetch-nui-query';
import { useQueryStateValue } from '@common/query/query-state';

const EXAMPLE_QUERY_KEY = ['example'] as const;

// NPWD occasionally has async calls to the server that should be cached globally.
// In this example, TanStack Query runs the handler on first subscription and keeps
// the result cached until the character reset provider clears the query client.
const fetchExampleString = async () => {
  try {
    return await fetchNuiData<string>(
      // Target event name
      'MyExampleTargetEvent',
      // Data you wish to pass to client scripts or to proxy to the server
      { myPassedData: 'hi!' },
      // The optional mockData argument resolves in browser/dev mode.
      buildRespObj('myMockDataResponse'),
    );
  } catch (e) {
    console.error(e);
    return '';
  }
};

export const exampleState = {
  example: EXAMPLE_QUERY_KEY,
};

export const useExampleStringValue = () =>
  useQueryStateValue<string>(EXAMPLE_QUERY_KEY, fetchExampleString, '');
