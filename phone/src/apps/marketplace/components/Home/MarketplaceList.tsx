import { Stack } from '@mui/material';
import { MarketplaceListing } from '@typings/marketplace';
import MarketplaceListItem from './MarketplaceListItem';

interface MarketplaceListProps {
  listings: MarketplaceListing[];
}
const MarketplaceList = ({ listings }: MarketplaceListProps) => {
  return (
    <Stack spacing={2}>
      {listings.map((listing) => (
        <MarketplaceListItem listing={listing} key={listing.id} />
      ))}
    </Stack>
  );
};

export default MarketplaceList;
