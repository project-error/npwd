import { BankingEvents, Transaction } from '../../typings/banking';
import { RegisterNuiCB, RegisterNuiProxy } from './cl_utils';
import { CallEvents, TransmitterNumDTO } from '@typings/call';
import { emitNetTyped } from '../server/utils/miscUtils';
import { onNetPromise } from '../server/lib/PromiseNetEvents/onNetPromise';
import { Contact, ContactEvents } from '@typings/contact';
import ContactService from '../server/contacts/contacts.service';
import { contactsLogger } from '../server/contacts/contacts.utils';
import { sendMessage } from '../utils/messages';
interface INotification {
  app: string;
  id?: string;
  title: string;
  content?: string;
  icon?: string;
  notificationIcon?: string;
  sound?: boolean;
  cantClose?: boolean;
  keepWhenPhoneClosed?: boolean;
  onClose?: (notification: INotification) => void;
  onClick?: (notification: INotification) => void;
  backgroundColor?: string;
  color?: string;
}

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

onNetPromise<void, INotification>('npwd:sendNotification', (reqObj, resp) => {
  sendMessage('GLOBALNOTIFICATION', 'sendNotification', reqObj.data);
});

// fetchNui("")
//onNet("npwd:sendNotification",  );
//abracadabra
