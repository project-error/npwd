import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import { useTransactions } from '../../hooks/useTransactions';
import useStyles from './account.styles';

export const AccountTransactions = (): any => {
  const classes = useStyles();

  const TransactionTypes = {
    Deposit: classes.depositType,
    Withdraw: classes.withdrawType,
    Transfer: classes.depositType,
  };

  const { transactionList } = useTransactions();
  const { t } = useTranslation();
  return (
    <div id="account-section">
      <div className={classes.header}>
        <h2 className={classes.title}>{t('APPS_BANK_ACCOUNT_TRANSACTIONS')}</h2>
        <Button className={classes.seeAll}>
          {t('APPS_BANK_ACCOUNT_SEE_TRANSACTION')}
        </Button>
      </div>

      <div className={classes.transcationDiv}>
        {transactionList.slice(0, 3).map((transaction: any) => (
          <div className={classes.transactions}>
            <div>
              <h1 className={classes.tranSource}>{transaction.source}</h1>
              <p className={classes.tranType}>{transaction.type}</p>
            </div>
            <div>
              <p className={TransactionTypes[transaction.type]}>
                {transaction.type === 'Withdraw' ? '-' : '+'}
                {transaction.amount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
