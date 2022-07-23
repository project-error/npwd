import { BankingEvents, Transaction } from '../../typings/banking';
import { RegisterNuiCB, RegisterNuiProxy } from './cl_utils';
// import { onNetPromise } from '../server/lib/PromiseNetEvents/onNetPromise';
import { sendMessage } from '../utils/messages';
export interface IUniversalNotification {
  app: string;
  id?: string;
  title: string;
  content?: string;
  icon?: string;
  notificationIcon?: string;
  sound?: boolean;
  cantClose?: boolean;
  keepWhenPhoneClosed?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  backgroundColor?: string;
  color?: string;
}

RegisterNuiProxy(BankingEvents.GET_ACCOUNTS);
RegisterNuiProxy(BankingEvents.TRANSFER_MONEY);
RegisterNuiProxy(BankingEvents.GET_TRANSACTIONS);
RegisterNuiCB<Transaction>(BankingEvents.TRANSFER_FINAL, (transaction, cb) => {
  console.log('transfer final was hit.');
  console.log(transaction);
  emitNet(
    'okokBanking:TransferMoney',
    transaction.value,
    transaction.sender_name,
    transaction.receiver_identifier,
    { bank: transaction.bank },
    transaction.receiver_name,
  );
  cb({});
});

onNet('npwd:sendNotification', (data: IUniversalNotification) => {
  sendMessage('GLOBALNOTIFICATION', 'sendNotification', data);
});

// fetchNui("")
//onNet("npwd:sendNotification",  );
//abracadabra
