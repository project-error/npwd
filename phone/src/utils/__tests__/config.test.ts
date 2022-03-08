import { deepMergeObjects } from '@shared/deepMergeObjects';
import { fetchConfig } from '@utils/config';
import { getResourceName } from '@utils/misc';
import defaultConfig from '../../../../config.default.json';

jest.mock('@utils/misc');
const mockedGetResourceName = getResourceName as jest.Mock;
const mockedFetch = jest.fn();

beforeEach(() => {
  global.fetch = mockedFetch as any;
});

describe('util: deepMergeObjects', () => {
  test('merges shallow fine', () => {
    const target = {
      ignore: true,
      defaultLanguage: 'en',
    };
    const source = {
      defaultLanguage: 'sv',
    };
    expect(deepMergeObjects(target, source)).toStrictEqual({
      ignore: true,
      defaultLanguage: 'sv',
    });
  });

  test('merges deep fine', () => {
    const target = {
      ignore: true,
      general: {
        defaultLanguage: 'en',
      },
    };

    const source = {
      general: {
        defaultLanguage: 'sv',
      },
    };

    expect(deepMergeObjects(target, source)).toStrictEqual({
      ignore: true,
      general: {
        defaultLanguage: 'sv',
      },
    });
  });

  test('merges multiple', () => {
    const target = {
      ignore: true,
      general: {
        defaultLanguage: 'en',
      },
    };

    const source = {
      general: {
        defaultLanguage: 'sv',
      },
    };

    const source2 = {
      general: {
        defaultLanguage: 'pl',
      },
    };

    expect(deepMergeObjects(target, source, source2)).toStrictEqual({
      ignore: true,
      general: {
        defaultLanguage: 'pl',
      },
    });
  });
});

describe('util: fetchConfig', () => {
  test('should merge with default', async () => {
    const userConfig = { defaultLanguage: 'sv' };

    mockedFetch.mockResolvedValue({ json: () => Promise.resolve(userConfig) });
    mockedGetResourceName.mockReturnValue('npwd');

    const mergedConfig = await fetchConfig();
    expect(mockedFetch).toHaveBeenCalledWith(`https://cfx-nui-npwd/config.json`);
    expect(mergedConfig).toStrictEqual({ ...defaultConfig, defaultLanguage: 'sv' });
  });
});
