import React from 'react';
import { List } from '../../../../ui/components/List';
import { useListing } from '../../hooks/useListing';
import { SelloutItem } from './SelloutItem';

export const SelloutList = () => {
  const listings = useListing();

  return (
    <List>
      {listings.map((listing) => (
        <SelloutItem key={listing.id} {...listing} />
      ))}
    </List>
  );
};
