import { useListingValue } from '@apps/marketplace/hooks/state';
import styled from '@emotion/styled';
import { Button, Card, Stack, Typography } from '@mui/material';
import { useApp } from '@os/apps/hooks/useApps';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import MarketplaceList from './MarketplaceList';
import MarketplaceSearch from './MarketplaceSearch';
import MarketplaceSort, { SortListingsFunction } from './MarketplaceSort';

const Container = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.5rem;

  background: ${({ theme }) => {
    return theme.palette.mode === 'dark'
      ? 'linear-gradient(#d04343, #212121)'
      : 'linear-gradient(52.04deg, #f2709c -36.64%, #fe9275 76.36%, #ff9472 84.56%)';
  }};
`;

const ListingsContainer = styled.section`
  flex: 1;
  padding: 1.5rem;
  margin: 4.5rem -1.5rem -1.5rem;
  background-color: ${({ theme }) => theme.palette.background.default};

  & > * {
    margin-top: -5rem;
  }
`;

const MarketplaceHome = () => {
  const { push } = useHistory();
  const { nameLocale, path } = useApp('MARKETPLACE');
  const { t } = useTranslation();
  const [terms, setTerms] = useState('');
  const [sortFunction, setSortFunction] = useState<SortListingsFunction>(null);
  const listings = useListingValue();

  const handleSortChange = useCallback((sortFunction) => {
    setSortFunction(() => sortFunction);
  }, []);

  const sortedListings = sortFunction ? [...listings].sort(sortFunction) : listings;
  const searchedListings = sortedListings.filter((listing) =>
    JSON.stringify(listing).toLowerCase().includes(terms.toLowerCase()),
  );

  return (
    <>
      <Container>
        <Stack spacing={6}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4" color="white">
              {t(nameLocale)}
            </Typography>
            <Button variant="contained" onClick={() => push(`${path}/new`)}>
              {t('MARKETPLACE.NEW_LISTING')}
            </Button>
          </Stack>

          <MarketplaceSearch onSearch={setTerms} />
          <MarketplaceSort onChange={handleSortChange} />
        </Stack>

        <ListingsContainer>
          {searchedListings.length <= 0 && (
            <Card sx={{ p: 3.5, borderRadius: 3 }}>
              {!terms && <Typography>{t('MARKETPLACE.NO_LISTINGS_YET')}</Typography>}
              {terms && <Typography>{t('MARKETPLACE.NO_LISTINGS_FOUND')}</Typography>}
            </Card>
          )}

          <MarketplaceList listings={searchedListings} />
        </ListingsContainer>
      </Container>
    </>
  );
};

export default MarketplaceHome;
