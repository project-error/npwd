import React from 'react';
import { List } from '../../../../ui/components/List';
import { useListing } from '../../hooks/useListing';
import { MarketplaceItem } from './MarketplaceItem';

export const MarketplaceList = () => {
  const listings = useListing();

  return (
    <List>
      {listings.map((listing) => (
        <MarketplaceItem key={listing.id} {...listing} />
      ))}
    </List>
  );
};
