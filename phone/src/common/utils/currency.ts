import config from '../../../../config.json';

const currencyFormatLanguage = config.general.currencyLanguage ?? 'en-US';

export const formatMoney = (amount: number, withCurrency = true) => {
  const formatter = withCurrency
    ? new Intl.NumberFormat(currencyFormatLanguage, {
        style: 'currency',
        currency: config.general.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    : new Intl.NumberFormat(currencyFormatLanguage);

  return formatter.format(amount);
};

export const getSignLocation = (formatLng?: string, currency?: string): 'before' | 'after' => {
  const formatter = new Intl.NumberFormat(formatLng ?? currencyFormatLanguage, {
    style: 'currency',
    currency: currency ?? config.general.currency,
  });

  const result = formatter.format(0);
  const isBefore = result.charAt(0) !== '0';

  return isBefore ? 'before' : 'after';
};

export const getCurrencySign = (formatLng?: string, currency?: string): string => {
  const formatter = new Intl.NumberFormat(formatLng ?? currencyFormatLanguage, {
    style: 'currency',
    currency: currency ?? config.general.currency,
  });

  const [result] = formatter.formatToParts(0).filter((part) => part.type === 'currency');

  return result.value;
};
