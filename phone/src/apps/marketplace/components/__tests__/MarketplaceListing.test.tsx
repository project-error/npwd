import { useListing } from '@apps/marketplace/hooks/state';
import { screen } from '@testing-library/react';
import { createMockedMarketplaceListing } from '@utils/mocks';
import { renderWithProviders } from '@utils/test';
import MarketplaceListing from '../Listing/MarketplaceListing';

jest.mock('@apps/marketplace/hooks/state', () => ({
  useListing: jest.fn(),
}));

const mockedUseListing = useListing as jest.Mock;

describe('Component: MarketplaceListing', () => {
  test('should render texts', () => {
    mockedUseListing.mockReturnValue(
      createMockedMarketplaceListing({ name: 'Kalle Larsson', price: 9000 }),
    );
    renderWithProviders(<MarketplaceListing />);

    expect(screen.getByText('title1')).toBeInTheDocument();
    expect(screen.getByText('description1')).toBeInTheDocument();
    expect(screen.getByTestId('seller')).toBeInTheDocument();
    expect(screen.getByText('KL')).toBeInTheDocument();
    expect(screen.getByText('Kalle Larsson')).toBeInTheDocument();
    expect(screen.getByText('$9,000')).toBeInTheDocument();
  });

  test('should not render avatar when no name', () => {
    mockedUseListing.mockReturnValue(createMockedMarketplaceListing({ name: '' }));
    renderWithProviders(<MarketplaceListing />);
    expect(screen.queryByTestId('seller')).not.toBeInTheDocument();
  });
});
