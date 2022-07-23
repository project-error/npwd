export const formatMoney = (balance: string | number) => {
  var numberBalance = Number(balance);
  var FormattedBalance = '';

  if (numberBalance < 100) {
    FormattedBalance = `${numberBalance.toFixed(2)}`;
  } else if (numberBalance < 1000) {
    FormattedBalance = `${Math.floor(numberBalance)}`;
  } else if (numberBalance < 1_000_000) {
    FormattedBalance = `${(numberBalance / 1000).toFixed(1)}K`;
  } else if (numberBalance < 1_000_000_000) {
    FormattedBalance = `${(numberBalance / 1_000_000).toFixed(1)}M`;
  } else {
    FormattedBalance = `${(numberBalance / 1_000_000_000).toFixed(1)}B`;
  }
  return FormattedBalance;
};
