import React, { useState } from 'react';
import useStyles from '../bank.styles';
import { useTranslation } from 'react-i18next';
import TablePagination from '@material-ui/core/TablePagination';
import { useTransactions } from '../../hooks/useTransactions';

export const TransactionList = () => {
  const transactionList = useTransactions();
  const { t } = useTranslation();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const TransactionTypes = {
    Deposit: classes.depositType,
    Withdraw: classes.withdrawType,
    Transfer: classes.depositType,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div id="transaction-section">
      <div className={classes.header}>
        <h2 className={classes.title}>{t('APPS_BANK_ACCOUNT_TRANSACTIONS')}</h2>
      </div>

      <div className={classes.transcationDiv}>
        {transactionList
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((transaction: any) => (
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
