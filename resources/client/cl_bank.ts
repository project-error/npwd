import { IAlertProps } from '../../typings/alerts';
import { BankEvents } from '../../typings/bank';

onNet(BankEvents.SEND_TRANSFERS, (transfer: any) => {
  SendNuiMessage(
    JSON.stringify({
      app: 'BANK',
      method: BankEvents.SEND_TRANSFERS,
      data: transfer,
    }),
  );
});

onNet(BankEvents.SEND_CREDENTIALS, (credentials: any) => {
  SendNuiMessage(
    JSON.stringify({
      app: 'BANK',
      method: BankEvents.SEND_CREDENTIALS,
      data: credentials,
    }),
  );
});

RegisterNuiCallbackType(BankEvents.ADD_TRANSFER);
on(`__cfx_nui:${BankEvents.ADD_TRANSFER}`, (data: any, cb: Function) => {
  emitNet(BankEvents.ADD_TRANSFER, data);
  cb();
});

onNet(BankEvents.ADD_TRANSFER_SUCCESS, () => {
  emitNet(BankEvents.FETCH_TRANSACTIONS);
});

onNet(BankEvents.TRANSACTION_ALERT, (result: IAlertProps) => {
  SendNuiMessage(
    JSON.stringify({
      app: 'BANK',
      method: 'setAlert',
      data: result,
    }),
  );
});

onNet(BankEvents.TRANSACTION_NOTIFICATION, (transfer: any) => {
  SendNuiMessage(
    JSON.stringify({
      app: 'BANK',
      method: 'setNotification',
      data: transfer,
    }),
  );
});
