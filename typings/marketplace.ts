export interface MarketplaceListing {
  id: number;
  identifier?: string;
  username: string;
  name: string;
  number: string;
  title: string;
  url: string;
  description: string;
}

export enum MarketplaceEvents {
  ADD_LISTING = 'npwd:addListing',
  ADD_LISTING_SUCCESS = 'npwd:addListingSuccess',
  FETCH_LISTING = 'npwd:fetchAllListings',
  SEND_LISTING = 'npwd:sendAllListings',
  ACTION_RESULT = 'npwd:selloutActionResult',
  DELETE_LISTING = 'npwd:marketplaceDeleteListing',
  DELETE_LISTING_SUCCESS = 'npwd:marketplaceDeleteListingSuccess',
  REPORT_LISTING = 'npwd:reportListing',
  REPORT_LISTING_SUCCESS = 'npwd:reportListingSuccess',
  REPORT_LISTING_SUCESS = 'npwd:reportListingFailed',
  SEND_ALERT = 'nwpd:sendListingAlert',
}
