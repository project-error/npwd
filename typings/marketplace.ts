export interface MarketplaceListing extends MarketplaceListingBase {
  id: number;
  identifier?: string;
  username: string;
  name: string;
  number: string;
}

export interface MarketplaceListingBase {
  title: string;
  url: string;
  description: string;
}

export enum MarketplaceDatabaseLimits {
  title = 255,
  description = 255,
  url = 255,
}

export enum ListingTypeResp {
  DUPLICATE = 'duplicate',
}

export enum MarketplaceEvents {
  ADD_LISTING = 'npwd:addListing',
  FETCH_LISTING = 'npwd:fetchAllListings',
  DELETE_LISTING = 'npwd:marketplaceDeleteListing',
  DELETE_LISTINGS_ON_DROP = 'npwd:marketplaceDeleteListingsOnDrop',
  REPORT_LISTING = 'npwd:reportListing',
  BROADCAST_ADD = 'npwd:sendMarketplaceBroadcastAdd',
  BROADCAST_DELETE = 'npwd:sendMarketplaceBroadcastDelete',
}

export interface MarketplaceBroadcastAddDTO {
  listing: MarketplaceListing;
}

export interface MarketplaceDeleteDTO {
  id: number;
}

export interface MarketplaceReportDTO {
  id: number;
}

export type ReportListingDTO = {
  id: number;
  title: string;
  description: string;
  url: string;
};
