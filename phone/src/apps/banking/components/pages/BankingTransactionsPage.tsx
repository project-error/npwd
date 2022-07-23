import {
  LinearProgress,
  List,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { BankingEvents, Transaction, TransactionType } from '@typings/banking';
import { TransactionItem } from '../TransactionItem';
import { isEnvBrowser } from '@utils/misc';

export const BankingTransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState(null);
  useEffect(() => {
    if (isEnvBrowser()) {
      const trans: Transaction[] = [];
      //   {
      //     id: 1,
      //     value: 100,
      //     sender_name: 'DSRPDEV',
      //     receiver_name: 'DSRPTEST',
      //     type: TransactionType.TRANSFER,
      //     sender_identifier: 'test',
      //     receiver_identifier: 'test',
      //   },
      //   {
      //     id: 2,
      //     value: 100,
      //     sender_name: 'DSRPDEV',
      //     receiver_name: 'DSRPTEST',
      //     type: TransactionType.DEPOSIT,
      //     sender_identifier: 'test',
      //     receiver_identifier: 'test',
      //   },
      //   {
      //     id: 3,
      //     value: 100,
      //     sender_name: 'DSRPDEV',
      //     receiver_name: 'DSRPTEST',
      //     type: TransactionType.WITHDRAW,
      //     sender_identifier: 'test',
      //     receiver_identifier: 'test',
      //   },
      //   {
      //     id: 4,
      //     value: 100,
      //     sender_name: 'DSRPDEV',
      //     receiver_name: 'DSRPTEST',
      //     type: TransactionType.TRANSFER,
      //     sender_identifier: 'test',
      //     receiver_identifier: 'test',
      //   },
      // ];
      setTransactions(trans);
    } else {
      fetchNui<ServerPromiseResp<Transaction[]>>(BankingEvents.GET_TRANSACTIONS).then((resp) => {
        if (resp.data) {
          setTransactions(resp.data);
        }
      });
    }
  });
  return (
    <div id={'transactions-page'}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>$</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions == null ? (
              <LinearProgress />
            ) : transactions.length == 0 ? (
              'No transactions found'
            ) : (
              transactions.map((transaction, item) => {
                return <TransactionItem transaction={transaction} />;
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/*<List>*/}
      {/*  {transactions.map((transaction, index)=>{*/}
      {/*    return <TransactionItem transaction={transaction}/>;*/}
      {/*  })}*/}
      {/*</List>*/}
    </div>
  );
};
