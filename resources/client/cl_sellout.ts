import { MarketplaceEvents, MarketplaceListing } from '../../typings/marketplace';
import { IAlertProps } from '../../typings/alerts';
import { sendMarketplaceEvent } from '../utils/messages';

RegisterNuiCallbackType(MarketplaceEvents.ADD_LISTING);

onNet(MarketplaceEvents.SEND_LISTING, (listing: MarketplaceListing) => {
  sendMarketplaceEvent('setListing', listing);
});

on(`__cfx_nui:${MarketplaceEvents.ADD_LISTING}`, (data: MarketplaceListing, cb: Function) => {
  emitNet(MarketplaceEvents.ADD_LISTING, data);
  cb();
});

RegisterNuiCallbackType(MarketplaceEvents.DELETE_LISTING);
on(`__cfx_nui:${MarketplaceEvents.DELETE_LISTING}`, (data: MarketplaceListing, cb: Function) => {
  emitNet(MarketplaceEvents.DELETE_LISTING, data.id);
  cb();
});

RegisterNuiCallbackType(MarketplaceEvents.REPORT_LISTING);
on(`__cfx_nui:${MarketplaceEvents.REPORT_LISTING}`, (data: MarketplaceListing, cb: Function) => {
  emitNet(MarketplaceEvents.REPORT_LISTING, data);
  cb();
});

onNet(MarketplaceEvents.ADD_LISTING_SUCCESS, () => {
  emitNet(MarketplaceEvents.FETCH_LISTING);
});

onNet(MarketplaceEvents.DELETE_LISTING_SUCCESS, () => {
  emitNet(MarketplaceEvents.FETCH_LISTING);
});

onNet(MarketplaceEvents.ACTION_RESULT, (alert: IAlertProps) => {
  sendMarketplaceEvent('setAlert', alert);
});
