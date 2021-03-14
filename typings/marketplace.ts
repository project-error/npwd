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
  ADD_LISTING = 'phone:addListing',
  ADD_LISTING_SUCCESS = 'phone:addListingSuccess',
  FETCH_LISTING = 'phone:fetchAllListings',
  SEND_LISTING = 'phone:sendAllListings',
  ACTION_RESULT = 'phone:selloutActionResult',
  DELETE_LISTING = 'phone:marketplaceDeleteListing',
  DELETE_LISTING_SUCCESS = 'phone:marketplaceDeleteListingSuccess',
  REPORT_LISTING = 'phone:reportListing',
  REPORT_LISTING_SUCCESS = 'phone:reportListingSuccess',
  REPORT_LISTING_SUCESS = 'phone:reportListingFailed',
}
