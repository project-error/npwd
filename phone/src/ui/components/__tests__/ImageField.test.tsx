import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@utils/test';
import ImageField from '../fields/ImageField';
import { createMemoryHistory } from 'history';

describe('Component: <ImageField />', () => {
  test('should go to camera when clicking button', () => {
    const history = createMemoryHistory({ initialEntries: ['/marketplace'] });
    renderWithProviders(<ImageField />, { history });

    expect(history.location.pathname).toBe('/marketplace');
    userEvent.click(screen.getByLabelText('image-button'));
    expect(history.location.pathname).toBe('/camera');
  });

  test('should call onSelectImage when there is image in url', () => {
    const history = createMemoryHistory({
      initialEntries: ['/marketplace?image=https://img.img/22'],
    });

    const onSelectImage = jest.fn();
    renderWithProviders(<ImageField onSelectImage={onSelectImage} />, { history });

    expect(onSelectImage).toHaveBeenCalledWith('https://img.img/22');
  });
});
