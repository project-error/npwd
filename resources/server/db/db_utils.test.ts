import * as db from './db_utils';

describe('parseSemiColonFormat', () => {
  it('Correctly parses configuration options', () => {
    const test = 'server=localhost;database=es_extended;userid=user;';
    const result = db.parseSemiColonFormat(test);

    expect(result.host).toEqual('localhost');
    expect(result.database).toEqual('es_extended');
    expect(result.user).toEqual('user');
    expect(result.password).toEqual(undefined);
  });
});
