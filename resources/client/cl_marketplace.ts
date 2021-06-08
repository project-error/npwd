import {
  MarketplaceBroadcastAddDTO,
  MarketplaceDeleteDTO,
  MarketplaceEvents,
} from '../../typings/marketplace';
import { RegisterNuiProxy } from './cl_utils';
import { sendMarketplaceEvent } from '../utils/messages';

RegisterNuiProxy(MarketplaceEvents.FETCH_LISTING);
RegisterNuiProxy(MarketplaceEvents.ADD_LISTING);

RegisterNuiProxy(MarketplaceEvents.DELETE_LISTING);
RegisterNuiProxy(MarketplaceEvents.REPORT_LISTING);

onNet(MarketplaceEvents.BROADCAST_ADD, (broadcastEvent: MarketplaceBroadcastAddDTO) => {
  sendMarketplaceEvent(MarketplaceEvents.BROADCAST_ADD, broadcastEvent);
});

onNet(MarketplaceEvents.BROADCAST_DELETE, (broadcastEvent: MarketplaceDeleteDTO) => {
  sendMarketplaceEvent(MarketplaceEvents.BROADCAST_DELETE, broadcastEvent);
});
