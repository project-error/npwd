import React from 'react';
import { List } from '@ui/components/List';
import { useListingValue } from '../../hooks/state';
import { MarketplaceItem } from './MarketplaceItem';

export const MarketplaceList: React.FC = () => {
  const listings = useListingValue();

  return (
    <List>
      {listings.map((listing) => (
        <MarketplaceItem key={listing.id} {...listing} />
      ))}
    </List>
  );
};
