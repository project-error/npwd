export interface MarketplaceListing {
  id: number;
  identifier?: string;
  name: string;
  number: string;
  title: string;
  url: string;
  description: string;
}

export enum MarketplaceNetEvents {
  ADD_LISTING = 'phone:addListing',
  ADD_LISTING_SUCCESS = 'phone:addListingSuccess',
  FETCH_LISTING = 'phone:fetchAllListings',
  SEND_LISTING = 'phone:sendAllListings',
  ACTION_RESULT = 'phone:selloutActionResult',
}
