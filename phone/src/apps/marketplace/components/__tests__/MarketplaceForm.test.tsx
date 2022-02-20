import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@utils/test';
import MarketplaceForm from '../MarketplaceForm';
import fetchNui from '@utils/fetchNui';
import { PhoneEvents } from '@typings/phone';
import { act } from 'react-dom/test-utils';

jest.mock('@utils/fetchNui');
const mockedFetchNui = fetchNui as jest.Mock;

describe('Component: MarketplaceForm', () => {
  test('should render initial values', () => {
    const onSubmit = jest.fn();
    renderWithProviders(
      <MarketplaceForm
        onSubmit={onSubmit}
        initialValues={{
          title: 'title1',
          description: 'description1',
          url: 'url1',
          price: '2000',
        }}
      />,
    );

    expect(screen.getByDisplayValue('title1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('description1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('url1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2000')).toBeInTheDocument();
  });

  test('should toggle keys on input (block movement ingame when focused)', async () => {
    const onSubmit = jest.fn();
    renderWithProviders(<MarketplaceForm onSubmit={onSubmit} />);

    act(() => {
      userEvent.click(screen.getByLabelText('title'));
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
      userEvent.click(screen.getByLabelText('title'));
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
