import { screen } from '@testing-library/react';
import { createMockedMarketplaceListing } from '@utils/mocks';
import { renderWithProviders } from '@utils/test';
import MarketplaceList from '../Home/MarketplaceList';

describe('Component: MarketplaceList', () => {
  test('should show listings from state', async () => {
    renderWithProviders(
      <MarketplaceList
        listings={[
          createMockedMarketplaceListing({
            id: 1,
            title: 'title1',
            description: 'description1',
          }),
          createMockedMarketplaceListing({
            id: 2,
            title: 'title2',
            description: 'description2',
          }),
        ]}
      />,
    );

    expect(screen.getByText('title1')).toBeInTheDocument();
    expect(screen.getByText('description1')).toBeInTheDocument();
    expect(screen.getByText('title2')).toBeInTheDocument();
    expect(screen.getByText('description2')).toBeInTheDocument();
  });
});
