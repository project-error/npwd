import events from '../utils/events';
import { MarketplaceListing } from '../../phone/src/common/typings/marketplace';
import { IAlertProps } from '../../phone/src/common/typings/alerts';

onNet(events.SELLOUT_SEND_LISTING, (listing: MarketplaceListing) => {
  SendNuiMessage(
    JSON.stringify({
      app: 'SELLOUT',
      method: 'setListings',
      data: listing,
    })
  );
});

RegisterNuiCallbackType(events.SELLOUT_ADD_LISTING);
on(`__cfx_nui:${events.SELLOUT_ADD_LISTING}`, (data: MarketplaceListing) => {
  emitNet(events.SELLOUT_ADD_LISTING, data);
});

// this will be triggerd when
// the adding of a new listing is successfully

onNet(events.SELLOUT_ADD_LISTING_SUCCESS, () => {
  emitNet(events.SELLOUT_FETCH_LISTING);
});

onNet(events.SELLOUT_ACTION_RESULT, (alert: IAlertProps) => {
  SendNuiMessage(
    JSON.stringify({
      app: 'SELLOUT',
      method: 'setAlert',
      data: alert,
    })
  );
});
