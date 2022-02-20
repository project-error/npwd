import { formatMoney, getCurrencySign, getSignLocation } from '../currency';

describe('util: formatMoney', () => {
  test('should format money with currency by default', () => {
    expect(formatMoney(2000)).toBe('$2,000');
  });
});

describe('util: getSignLocation', () => {
  test('should return correct signLocation for default language', () => {
    expect(getSignLocation()).toBe('before');
  });

  test('should return correct signLocation for swedish', () => {
    expect(getSignLocation('se', 'SEK')).toBe('after');
  });
});

describe('util: getCurrencySign', () => {
  describe('should return the correct currency sign:', () => {
    test('USD', () => {
      expect(getCurrencySign('en-US', 'USD')).toBe('$');
    });

    test('SEK', () => {
      expect(getCurrencySign('sv', 'SEK')).toBe('kr');
    });

    test('NOK', () => {
      expect(getCurrencySign('no', 'NOK')).toBe('kr');
    });

    test('EUR', () => {
      expect(getCurrencySign('de', 'EUR')).toBe('€');
    });

    test('JPY', () => {
      expect(getCurrencySign('ja-JP', 'JPY')).toBe('￥');
    });
  });
});
