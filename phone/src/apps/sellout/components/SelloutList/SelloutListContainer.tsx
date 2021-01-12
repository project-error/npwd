import React from 'react';
import { useListing } from '../../hooks/useListing';
import { SelloutList } from './SelloutList';

export const SelloutListContainer = () => {
  const { listing } = useListing();
  return <SelloutList listings={listing} />;
};
