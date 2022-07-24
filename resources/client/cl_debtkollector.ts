import { BillingEvents, Bills } from '../../typings/debtkollector';
import { RegisterNuiCB, RegisterNuiProxy } from './cl_utils';

RegisterNuiProxy(BillingEvents.GET_BILLS);

RegisterNuiCB<number>(BillingEvents.PAY_BILL, (billID: number, cb) => {
  console.log('paying bill nui callback, emitting payBill', billID);
  emitNet('esx_billing:payBillEvent', billID);

  cb({});
});
