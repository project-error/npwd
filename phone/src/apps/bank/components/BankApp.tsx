import React from 'react';
import { makeStyles } from '@material-ui/core';
import { BankTitle } from './BankTitle';
import { AppWrapper } from '../../../ui/components';
import { AppContent } from '../../../ui/components/AppContent';
import './BankApp.css';
import { TransferModal } from './transfers/TransferModal';

import { useBankModal } from '../hooks/useBankModal';

import { Switch, Route } from 'react-router-dom';
import { NavigationBar } from './navigation/NavigationBar';

import { BankHome } from './home/BankHome';
import { BankAccount } from './account/BankAccount';
import { TransactionList } from './transactions/TransactionList';
import { BankAlert } from './alert/BankAlert';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '90px',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#fb8c00',
    alignItems: 'center',
  },
  header: {
    fontFamily: "'Bebas Neue', cursive",
    textAlign: 'center',
    fontSize: 50,
  },
  backgroundModal: {
    background: 'black',
    opacity: '0.6',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
}));

export const BankApp = () => {
  const { showBankModal } = useBankModal();
  const classes = useStyles();

  return (
    <AppWrapper id='bank-app'>
      <BankTitle />
      <TransferModal />
      <div className={showBankModal ? classes.backgroundModal : undefined} />
      <AppContent>
        <Switch>
          <Route path='/bank' exact component={BankHome} />
          <Route path='/bank/account' exact component={BankAccount} />
          <Route path='/bank/transactions' exact component={TransactionList} />
        </Switch>
        <BankAlert />
      </AppContent>
      <NavigationBar />
    </AppWrapper>
  );
};
