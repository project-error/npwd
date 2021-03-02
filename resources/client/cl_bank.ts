import { IAlertProps } from '../../phone/src/common/typings/alerts';
import events from '../utils/events';

onNet(events.BANK_SEND_TRANSFERS, (transfer: any) => {
  SendNuiMessage(
    JSON.stringify({
      app: 'BANK',
      method: 'setTransaction',
      data: transfer,
    }),
  );
});

onNet(events.BANK_SEND_CREDENTIALS, (credentials: any) => {
  SendNuiMessage(
    JSON.stringify({
      app: 'BANK',
      method: 'setCredentials',
      data: credentials,
    }),
  );
});

RegisterNuiCallbackType(events.BANK_ADD_TRANSFER);
on(`__cfx_nui:${events.BANK_ADD_TRANSFER}`, (data: any, cb: Function) => {
  emitNet(events.BANK_ADD_TRANSFER, data);
  cb();
});

onNet(events.BANK_ADD_TRANSFER_SUCCESS, () => {
  emitNet(events.BANK_FETCH_TRANSACTIONS);
});

onNet(events.BANK_TRANSACTION_ALERT, (result: IAlertProps) => {
  SendNuiMessage(
    JSON.stringify({
      app: 'BANK',
      method: 'setAlert',
      data: result,
    }),
  );
});

onNet(events.BANK_TRANSACTION_NOTIFICATION, (transfer: any) => {
  SendNuiMessage(
    JSON.stringify({
      app: 'BANK',
      method: 'setNotification',
      data: transfer,
    }),
  );
});
