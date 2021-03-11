import events from '../utils/events';
import { MarketplaceListing } from '../../phone/src/common/typings/marketplace';
import { IAlertProps } from '../../phone/src/common/typings/alerts';

onNet(events.SELLOUT_SEND_LISTING, (listing: MarketplaceListing) => {
  SendNuiMessage(
    JSON.stringify({
      app: 'SELLOUT',
      method: 'setListings',
      data: listing,
    }),
  );
});

RegisterNuiCallbackType(events.SELLOUT_ADD_LISTING);
on(`__cfx_nui:${events.SELLOUT_ADD_LISTING}`, (data: MarketplaceListing, cb: Function) => {
  emitNet(events.SELLOUT_ADD_LISTING, data);
  cb();
});

RegisterNuiCallbackType(events.SELLOUT_DELETE_LISTING);
on(`__cfx_nui:${events.SELLOUT_DELETE_LISTING}`, (data: MarketplaceListing, cb: Function) => {
  emitNet(events.SELLOUT_DELETE_LISTING, data.id);
  cb();
});

RegisterNuiCallbackType(events.SELLOUT_REPORT_LISTING);
on(`__cfx_nui:${events.SELLOUT_REPORT_LISTING}`, (data: MarketplaceListing, cb: Function) => {
  emitNet(events.SELLOUT_REPORT_LISTING, data);
  cb();
});

onNet(events.SELLOUT_ADD_LISTING_SUCCESS, () => {
  emitNet(events.SELLOUT_FETCH_LISTING);
});

onNet(events.SELLOUT_DELETE_LISTING_SUCCESS, () => {
  emitNet(events.SELLOUT_FETCH_LISTING);
});

onNet(events.SELLOUT_ACTION_RESULT, (alert: IAlertProps) => {
  SendNuiMessage(
    JSON.stringify({
      app: 'SELLOUT',
      method: 'setAlert',
      data: alert,
    }),
  );
});
