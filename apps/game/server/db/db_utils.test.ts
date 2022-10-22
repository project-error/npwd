import * as db from './db_utils';
const testStrings = [
  'server=127.0.0.1;database=es_extended;userid=user',
  'host=127.0.0.1;database=es_extended;userid=user;',
  'addr=127.0.0.1;;db=es_extended;uid=user;;',
];

describe('parseSemiColonFormat', () => {
  testStrings.forEach((test) => {
    it('Correctly parses configuration options', () => {
      const result = db.parseSemiColonFormat(test);

      expect(result.host).toEqual('127.0.0.1');
      expect(result.database).toEqual('es_extended');
      expect(result.user).toEqual('user');
      expect(result.password).toEqual(undefined);
    });
  });
});
