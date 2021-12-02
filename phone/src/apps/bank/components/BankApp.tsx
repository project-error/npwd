import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { BankTitle } from './BankTitle';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import './BankApp.css';
import { TransferModal } from './transfers/TransferModal';

import { useBankModal } from '../hooks/useBankModal';

import { Switch, Route } from 'react-router-dom';
import { NavigationBar } from './navigation/NavigationBar';

import { BankHome } from './home/BankHome';
import { BankAccount } from './account/BankAccount';
import { TransactionList } from './transactions/TransactionList';
import InjectDebugData from '../../../os/debug/InjectDebugData';

InjectDebugData([
  {
    app: 'BANK',
    method: 'setCredentials',
    data: {
      name: 'Firstname Lastname',
      balance: 2000,
    },
  },
  {
    app: 'BANK',
    method: 'setTransaction',
    data: [
      {
        id: 1,
        amount: 200,
        type: 'Deposit',
        source: 'chip',
      },
      {
        id: 2,
        amount: 200,
        type: 'Withdraw',
        source: 'chip',
      },
      {
        id: 3,
        amount: 200,
        type: 'Withdraw',
        source: 'chip',
      },
      {
        id: 4,
        amount: 50,
        type: 'Deposit',
        source: 'chip',
      },
      {
        id: 4,
        amount: 50,
        type: 'Deposit',
        source: 'chip',
      },
      {
        id: 4,
        amount: 50,
        type: 'Deposit',
        source: 'chip',
      },
    ],
  },
]);

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
    <AppWrapper id="bank-app">
      <BankTitle />
      <TransferModal />
      <div className={showBankModal ? classes.backgroundModal : undefined} />
      <AppContent>
        <Switch>
          <Route path="/bank" exact component={BankHome} />
          <Route path="/bank/account" exact component={BankAccount} />
          <Route path="/bank/transactions" exact component={TransactionList} />
        </Switch>
      </AppContent>
      <NavigationBar />
    </AppWrapper>
  );
};
