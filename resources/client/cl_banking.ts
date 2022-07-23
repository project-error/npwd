import { BankingEvents, Transaction } from '../../typings/banking';
import { RegisterNuiCB, RegisterNuiProxy } from './cl_utils';
import { CallEvents, TransmitterNumDTO } from '@typings/call';
import { emitNetTyped } from '../server/utils/miscUtils';

RegisterNuiProxy(BankingEvents.GET_ACCOUNTS);
RegisterNuiProxy(BankingEvents.TRANSFER_MONEY);
RegisterNuiProxy(BankingEvents.GET_TRANSACTIONS);
RegisterNuiCB<Transaction>('npwd:transferFinal', (transaction, cb) => {
  console.log(transaction);
  emitNet(
    'npwd:TransferMoney',
    transaction.value,
    transaction.sender_name,
    transaction.receiver_identifier,
    { bank: transaction.bank },
    transaction.receiver_name,
  );
  cb({});
});
