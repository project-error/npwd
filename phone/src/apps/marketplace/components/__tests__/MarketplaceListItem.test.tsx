import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH_WITHOUT_IMAGE,
} from '@apps/marketplace/constants';
import { formatMoney } from '@common/utils/currency';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockedMarketplaceListing } from '@utils/mocks';
import { renderWithProviders } from '@utils/test';
import { createMemoryHistory } from 'history';
import MarketplaceListItem from '../Home/MarketplaceListItem';

describe('Component: MarketplaceListItem', () => {
  test('should show listings from state', async () => {
    const listing = createMockedMarketplaceListing({
      title: 'title1',
      description: 'description1',
      price: 90000,
      name: 'Charles Carlsberg',
    });

    renderWithProviders(<MarketplaceListItem listing={listing} />);

    expect(screen.getByText('title1')).toBeInTheDocument();
    expect(screen.getByText('description1')).toBeInTheDocument();
    expect(screen.getByText('Seller')).toBeInTheDocument();
    expect(screen.getByText('Charles Carlsberg')).toBeInTheDocument();
    expect(screen.getByText('$90,000')).toBeInTheDocument();

    expect(screen.queryByText('200-200')).not.toBeInTheDocument();
    expect(screen.queryByText('username')).not.toBeInTheDocument();
    expect(screen.queryByText('identifier')).not.toBeInTheDocument();
  });

  test('should goto listing when clicked', async () => {
    const history = createMemoryHistory({ initialEntries: ['/marketplace'] });
    const listing = createMockedMarketplaceListing({ title: 'title1' });

    renderWithProviders(<MarketplaceListItem listing={listing} />, { history });
    userEvent.click(screen.getByText('title1'));

    expect(history.location.pathname).toBe('/marketplace/1');
  });

  test('should shorten description when too long (with image)', async () => {
    const listing = createMockedMarketplaceListing({
      title: 'title1',
      description: 'k'.repeat(DESCRIPTION_MAX_LENGTH + 1),
    });

    renderWithProviders(<MarketplaceListItem listing={listing} />);
    expect(screen.getByText('k'.repeat(DESCRIPTION_MAX_LENGTH) + '...')).toBeInTheDocument();
  });

  test('should shorten description when too long (without image)', async () => {
    const listing = createMockedMarketplaceListing({
      title: 'title1',
      description: 'k'.repeat(DESCRIPTION_MAX_LENGTH_WITHOUT_IMAGE + 1),
      url: '',
    });

    renderWithProviders(<MarketplaceListItem listing={listing} />);
    expect(
      screen.getByText('k'.repeat(DESCRIPTION_MAX_LENGTH_WITHOUT_IMAGE) + '...'),
    ).toBeInTheDocument();
  });

  test('should not display seller when there is none', async () => {
    const listing = createMockedMarketplaceListing({
      title: 'title1',
      name: '',
    });

    renderWithProviders(<MarketplaceListItem listing={listing} />);
    expect(screen.queryByText('Seller')).not.toBeInTheDocument();
  });

  test('should not display price when there is none', async () => {
    const listing = createMockedMarketplaceListing({
      title: 'title1',
      price: 0,
    });

    renderWithProviders(<MarketplaceListItem listing={listing} />);
    expect(screen.queryByText(formatMoney(listing.price))).not.toBeInTheDocument();
  });
});
