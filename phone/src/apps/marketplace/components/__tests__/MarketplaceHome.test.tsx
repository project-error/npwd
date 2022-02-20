import { useListingValue } from '@apps/marketplace/hooks/state';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockedMarketplaceListing } from '@utils/mocks';
import { renderWithProviders } from '@utils/test';
import MarketplaceHome from '../Home/MarketplaceHome';

jest.mock('@apps/marketplace/hooks/state', () => ({
  useListingValue: jest.fn(),
}));

const mockedUseListingValue = useListingValue as jest.Mock;

describe('Component: MarketplaceHome', () => {
  test('should default texts, title & create new listing', () => {
    mockedUseListingValue.mockReturnValue([]);

    renderWithProviders(<MarketplaceHome />);

    expect(screen.getByText('Marketplace')).toBeInTheDocument();
    expect(screen.getByText('New listing')).toBeInTheDocument();
  });

  test('should search', () => {
    mockedUseListingValue.mockReturnValue([
      createMockedMarketplaceListing({ id: 1, title: 'title1', description: 'description1' }),
      createMockedMarketplaceListing({ id: 2, title: 'title2', description: 'description2' }),
    ]);

    renderWithProviders(<MarketplaceHome />);

    expect(screen.getByText('title1')).toBeInTheDocument();
    expect(screen.getByText('description1')).toBeInTheDocument();
    expect(screen.getByText('title2')).toBeInTheDocument();
    expect(screen.getByText('description2')).toBeInTheDocument();

    userEvent.type(screen.getByLabelText('Search'), 'title2{enter}');

    expect(screen.queryByText('title1')).not.toBeInTheDocument();
    expect(screen.queryByText('description1')).not.toBeInTheDocument();
    expect(screen.getByText('title2')).toBeInTheDocument();
    expect(screen.getByText('description2')).toBeInTheDocument();
  });

  describe('should sort correctly:', () => {
    test('price', () => {
      mockedUseListingValue.mockReturnValue([
        createMockedMarketplaceListing({
          id: 1,
          title: 'title',
          description: 'description1',
          price: 100,
        }),
        createMockedMarketplaceListing({
          id: 2,
          title: 'title',
          description: 'description2',
          price: 2000,
        }),
      ]);

      renderWithProviders(<MarketplaceHome />);

      userEvent.click(screen.getByLabelText('sort'));
      userEvent.click(screen.getByLabelText('priceLowest'));

      const titles1 = screen.getAllByText('title');
      expect(titles1[0].nextElementSibling.textContent).toBe('description1');

      userEvent.click(screen.getByLabelText('sort'));
      userEvent.click(screen.getByLabelText('priceHighest'));

      const titles2 = screen.getAllByText('title');
      expect(titles2[0].nextElementSibling.textContent).toBe('description2');
    });
  });
});
