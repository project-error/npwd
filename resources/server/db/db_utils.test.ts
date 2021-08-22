import * as db from './db_utils';

const t = 'test value';

describe('parseSemiColonFormat', () => {
  it('Raises a error with invalid string', () => {
    expect(() => db.parseSemiColonFormat('no_variables_here')).toThrowError();
  });

  it('Correctly parses configuration options', () => {
    const test = 'server=127.0.0.1;database=es_extended;userid=user;';
    const result = db.parseSemiColonFormat(test);

    expect(result.server).toEqual('127.0.0.1');
    expect(result.database).toEqual('es_extended');
    expect(result.userid).toEqual('user');
    expect(result.password).toEqual(undefined);
  });
});

describe('getServerHost', () => {
  it('returns default', () => {
    expect(db.getServerHost({})).toEqual(db.DEFAULT_HOST);
  });

  it('Correctly returns host', () => {
    expect(db.getServerHost({ host: t })).toEqual(t);
  });

  it('Correctly returns server', () => {
    expect(db.getServerHost({ server: t })).toEqual(t);
  });

  it('Correctly returns data source', () => {
    expect(db.getServerHost({ 'data source': t })).toEqual(t);
  });

  it('Correctly returns datasource', () => {
    expect(db.getServerHost({ datasource: t })).toEqual(t);
  });

  it('Correctly returns addr', () => {
    expect(db.getServerHost({ addr: t })).toEqual(t);
  });

  it('Correctly returns address', () => {
    expect(db.getServerHost({ address: t })).toEqual(t);
  });
});

describe('getUserId', () => {
  it('returns default', () => {
    expect(db.getUserId({})).toEqual(db.DEFAULT_USER);
  });

  it('Correctly returns user', () => {
    expect(db.getUserId({ user: t })).toEqual(t);
  });

  it('Correctly returns user id', () => {
    expect(db.getUserId({ 'user id': t })).toEqual(t);
  });

  it('Correctly returns userid', () => {
    expect(db.getUserId({ userid: t })).toEqual(t);
  });

  it('Correctly returns user name', () => {
    expect(db.getUserId({ 'user name': t })).toEqual(t);
  });

  it('Correctly returns username', () => {
    expect(db.getUserId({ username: t })).toEqual(t);
  });

  it('Correctly returns uid', () => {
    expect(db.getUserId({ uid: t })).toEqual(t);
  });
});

describe('getPassword', () => {
  // it("returns default", () => {
  //   expect(() => db.getPassword({})).toThrowError();
  // });

  it('Correctly returns password', () => {
    expect(db.getPassword({ password: t })).toEqual(t);
  });

  it('Correctly returns pwd', () => {
    expect(db.getPassword({ pwd: t })).toEqual(t);
  });
});
