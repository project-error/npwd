import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH_WITHOUT_IMAGE,
} from '@apps/marketplace/constants';
import { formatMoney } from '@common/utils/currency';
import { Box, Card, CardMedia, Stack, styled, Typography } from '@mui/material';
import { useApp } from '@os/apps/hooks/useApps';
import { MarketplaceListing } from '@typings/marketplace';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const StyledCard = styled(Card)({
  display: 'flex',
  borderRadius: '0.75rem',
  cursor: 'pointer',
});

const StyledCardMedia = styled(CardMedia)({
  flex: 1,
});

const StyledBox = styled(Box)({
  flex: 1.3,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  padding: '1rem',
  position: 'relative',
});

interface MarketplaceListItemProps {
  listing: MarketplaceListing;
}

const MarketplaceListItem = ({ listing }: MarketplaceListItemProps) => {
  const app = useApp('MARKETPLACE');
  const { t } = useTranslation();
  const { push } = useHistory();

  const hasImage = Boolean(listing.url);
  const maxLengthDescription = hasImage
    ? DESCRIPTION_MAX_LENGTH
    : DESCRIPTION_MAX_LENGTH_WITHOUT_IMAGE;

  const shortDescription =
    listing.description.length > maxLengthDescription
      ? `${listing.description.substring(0, maxLengthDescription)}...`
      : listing.description;

  const gotoListing = () => push(`${app.path}/${listing.id}`);

  return (
    <StyledCard
      key={listing.id}
      onClick={gotoListing}
      tabIndex={0}
      role="button"
      onKeyDown={({ key }) => {
        if (key === 'Enter') {
          gotoListing();
        }
      }}
    >
      <StyledBox>
        <Typography variant="h6" overflow="hidden" textOverflow="ellipsis">
          {listing.title}
        </Typography>
        <Typography variant="body2" overflow="hidden" textOverflow="ellipsis">
          {shortDescription}
        </Typography>

        {(listing.price > 0 || listing.name) && (
          <Stack
            marginTop={2}
            spacing={1.5}
            width="100%"
            direction={hasImage ? 'column' : 'row'}
            justifyContent="space-between"
          >
            {listing.price > 0 && (
              <Typography variant="h6">{formatMoney(listing.price)}</Typography>
            )}

            {listing.name && (
              <Stack spacing={-0.25}>
                <Typography variant="caption">{t('MARKETPLACE.SELLER')}</Typography>
                <Typography variant="caption">{listing.name}</Typography>
              </Stack>
            )}
          </Stack>
        )}
      </StyledBox>

      {listing.url && <StyledCardMedia image={listing.url} />}
    </StyledCard>
  );
};

export default MarketplaceListItem;
