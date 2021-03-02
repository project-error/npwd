import React from 'react';
import { Typography } from '@material-ui/core';
import { Button } from '../../../../ui/components/Button';
import { useTranslation } from 'react-i18next';

import { useBankModal } from '../../hooks/useBankModal';
import { useCredentials } from '../../hooks/useCredentials';
import { NavLink } from 'react-router-dom';

import useStyles from './home.styles';

export const BankHome = () => {
  const classes = useStyles();
  const { setShowBankModal } = useBankModal();
  const { credentials } = useCredentials();
  const { t } = useTranslation();

  const openTransactionsModal = () => {
    setShowBankModal(true);
  };

  if (!credentials) return <p>Could not load credentials</p>;

  return (
    <div className={classes.root}>
      <Typography className={classes.headTitle}>
        <span style={{ fontWeight: 'bold' }}>{t('APPS_BANK_HOME_TITLE')}</span>,{' '}
        {credentials.name}
      </Typography>
      <div className={classes.accounts}>
        <h2 className={classes.accountsType}>Checking:</h2>
        <p className={classes.accountBalance}>{credentials.balance}</p>
      </div>
      <div className={classes.actions}>
        <Button id="actionButton" className={classes.actionButton}>
          <NavLink to="/bank/account">{t('APPS_BANK_ACCOUNT_LINK')}</NavLink>
        </Button>
        <Button onClick={openTransactionsModal} className={classes.actionButton}>
          {t('APPS_BANK_ACTIONS_TRANSFER')}
        </Button>
      </div>
    </div>
  );
};
