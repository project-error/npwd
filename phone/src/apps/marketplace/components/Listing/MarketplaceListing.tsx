import { formatMoney } from '@common/utils/currency';
import { getInitials } from '@common/utils/names';
import { Chat } from '@mui/icons-material';
import Phone from '@mui/icons-material/Phone';
import { Avatar, Box, Divider, IconButton, Stack, styled, Typography } from '@mui/material';
import { useCall } from '@os/call/hooks/useCall';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { PictureResponsive } from '@ui/components/PictureResponsive';
import { PictureReveal } from '@ui/components/PictureReveal';
import { useHistory, useParams } from 'react-router-dom';
import { useListing } from '../../hooks/state';
import MarketplaceListingHeader from './MarketplaceListingHeader';

const Container = styled(Box)({
  position: 'relative',
});

const ImageContainer = styled('div')({
  minHeight: '14.3rem',
});

const StyledBox = styled(Box)({
  flex: 1.3,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  padding: '1.5rem',
  position: 'relative',
});

const MarketplaceListing = () => {
  const { initializeCall } = useCall();
  const { push } = useHistory();
  const { id } = useParams<{ id: string }>();
  const listing = useListing(Number(id));
  const myNumber = useMyPhoneNumber();
  const isMyListing = listing.number === myNumber;

  const handleCall = () => {
    initializeCall(listing.number);
  };

  const handleChat = () => {
    push(`/messages/new?phoneNumber=${listing.number}`);
  };

  return (
    <Container>
      <MarketplaceListingHeader isMyListing={isMyListing} hasImage={Boolean(listing.url)} />
      {listing.url && (
        <ImageContainer>
          <PictureReveal>
            <PictureResponsive src={listing.url} alt={`${listing.name}`} />
          </PictureReveal>
        </ImageContainer>
      )}

      <StyledBox p={3}>
        <Stack spacing={2}>
          <Typography variant="h4" overflow="hidden" textOverflow="ellipsis">
            {listing.title}
          </Typography>

          <Divider light />

          <Typography variant="body1" overflow="hidden" textOverflow="ellipsis">
            {listing.description}
          </Typography>

          <Typography variant="h6" textAlign="right">
            {formatMoney(listing.price)}
          </Typography>

          <Divider light />

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            {listing.name && (
              <Stack direction="row" alignItems="center" spacing={2} data-testid="seller">
                <Avatar>{getInitials(listing.name)}</Avatar>
                <Typography variant="body1">{listing.name}</Typography>
              </Stack>
            )}

            {!isMyListing && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={handleCall}>
                  <Phone />
                </IconButton>
                <IconButton onClick={handleChat}>
                  <Chat />
                </IconButton>
              </Stack>
            )}
          </Stack>
        </Stack>
      </StyledBox>
    </Container>
  );
};

export default MarketplaceListing;
