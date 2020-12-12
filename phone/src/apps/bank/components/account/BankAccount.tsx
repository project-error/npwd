import React from 'react';
import { Button } from '../../../../ui/components/Button';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { BankCard } from './BankCard';
import { AccountTransactions } from './AccountTransactions';
import { useCredentials } from '../../hooks/useCredentials';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    fontFamily: 'Bahnschrift Regular',
  },
  title: {
    fontSize: '30px',
    marginLeft: '29px',
  },
}));

export const BankAccount = () => {
  const classes = useStyles();
  const { credentials } = useCredentials();
  const { t } = useTranslation();
  return (
    <div className={classes.root}>
      <div>
        <h1 className={classes.title}>{t('APPS_BANK_ACCOUNT_TITLE')}</h1>
      </div>
      <BankCard
        name={credentials.name}
        account='Checking'
        balance={credentials.balance}
      />
      <AccountTransactions />
    </div>
  );
};
