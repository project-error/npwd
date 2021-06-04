import { MarketplaceEvents, MarketplaceListingBroadcast } from '../../typings/marketplace';
import { RegisterNuiProxy } from './cl_utils';
import { sendMarketplaceEvent } from '../utils/messages';

// onNet(MarketplaceEvents.SEND_LISTING, (listings: MarketplaceListing[]) => {
//   sendMarketplaceEvent(MarketplaceEvents.SEND_LISTING, listings);
// });

RegisterNuiProxy(MarketplaceEvents.FETCH_LISTING);
RegisterNuiProxy(MarketplaceEvents.ADD_LISTING);

// RegisterNuiCallbackType(MarketplaceEvents.ADD_LISTING);
// on(`__cfx_nui:${MarketplaceEvents.ADD_LISTING}`, (data: MarketplaceListing, cb: Function) => {
//   emitNet(MarketplaceEvents.ADD_LISTING, data);
//   cb();
// });

RegisterNuiProxy(MarketplaceEvents.DELETE_LISTING);
RegisterNuiProxy(MarketplaceEvents.REPORT_LISTING);

onNet(MarketplaceEvents.BROADCAST_EVENT, (broadcastEvent: MarketplaceListingBroadcast) => {
  sendMarketplaceEvent(MarketplaceEvents.BROADCAST_EVENT, broadcastEvent);
});

// RegisterNuiCallbackType(MarketplaceEvents.DELETE_LISTING);
// on(`__cfx_nui:${MarketplaceEvents.DELETE_LISTING}`, (data: MarketplaceListing, cb: Function) => {
//   emitNet(MarketplaceEvents.DELETE_LISTING, data.id);
//   cb();
// });

// RegisterNuiCallbackType(MarketplaceEvents.REPORT_LISTING);
// on(`__cfx_nui:${MarketplaceEvents.REPORT_LISTING}`, (data: MarketplaceListing, cb: Function) => {
//   emitNet(MarketplaceEvents.REPORT_LISTING, data);
//   cb();
// });

// onNet(MarketplaceEvents.ADD_LISTING_SUCCESS, () => {
//   emitNet(MarketplaceEvents.FETCH_LISTING);
// });

// onNet(MarketplaceEvents.DELETE_LISTING_SUCCESS, () => {
//   emitNet(MarketplaceEvents.FETCH_LISTING);
// });

// onNet(MarketplaceEvents.ACTION_RESULT, (alert: IAlertProps) => {
//   sendMarketplaceEvent(MarketplaceEvents.SEND_ALERT, alert);
// });
