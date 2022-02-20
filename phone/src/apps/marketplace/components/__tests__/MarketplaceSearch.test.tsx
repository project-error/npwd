import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhoneEvents } from '@typings/phone';
import fetchNui from '@utils/fetchNui';
import { renderWithProviders } from '@utils/test';
import { act } from 'react-dom/test-utils';
import MarketplaceSearch from '../Home/MarketplaceSearch';

jest.mock('@utils/fetchNui');
const mockedFetchNui = fetchNui as jest.Mock;

describe('Component: MarketplaceSearch', () => {
  test('should render texts', () => {
    const handleSearch = jest.fn();
    renderWithProviders(<MarketplaceSearch onSearch={handleSearch} />);

    userEvent.type(screen.getByRole('textbox'), 'cars{enter}');
    expect(handleSearch).toHaveBeenCalledWith('cars');
  });

  test('should search when clicking the button', () => {
    const handleSearch = jest.fn();
    renderWithProviders(<MarketplaceSearch onSearch={handleSearch} />);

    userEvent.type(screen.getByRole('textbox'), 'cars');
    userEvent.click(screen.getByRole('button'));

    expect(handleSearch).toHaveBeenCalledWith('cars');
  });

  test('should toggle keys on input (block movement ingame when focused)', async () => {
    const handleSearch = jest.fn();
    renderWithProviders(<MarketplaceSearch onSearch={handleSearch} />);

    act(() => {
      userEvent.click(screen.getByRole('textbox'));
      userEvent.tab();
    });

    await waitFor(() => {
      expect(mockedFetchNui).toHaveBeenCalledWith(
        PhoneEvents.TOGGLE_KEYS,
        { keepGameFocus: false },
        {},
      );
    });

    act(() => {
      userEvent.click(screen.getByRole('textbox'));
    });

    await waitFor(() => {
      expect(mockedFetchNui).toHaveBeenCalledWith(
        PhoneEvents.TOGGLE_KEYS,
        { keepGameFocus: true },
        {},
      );
    });
  });
});
