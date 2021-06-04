import { MarketplaceEvents, MarketPlaceBroadcastData } from '../../typings/marketplace';
import { RegisterNuiProxy } from './cl_utils';
import { sendMarketplaceEvent } from '../utils/messages';

RegisterNuiProxy(MarketplaceEvents.FETCH_LISTING);
RegisterNuiProxy(MarketplaceEvents.ADD_LISTING);

RegisterNuiProxy(MarketplaceEvents.DELETE_LISTING);
RegisterNuiProxy(MarketplaceEvents.REPORT_LISTING);

onNet(MarketplaceEvents.BROADCAST_EVENT, (broadcastEvent: MarketPlaceBroadcastData) => {
  sendMarketplaceEvent(MarketplaceEvents.BROADCAST_EVENT, broadcastEvent);
});
