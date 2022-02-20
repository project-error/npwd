import { render, screen } from '@testing-library/react';
import PriceField from '../fields/PriceField';
import userEvent from '@testing-library/user-event';
import { ChangeEvent } from 'react';

describe('Component: <PriceField />', () => {
  test('should format input on onChange', () => {
    const onChange: jest.Mock<
      ChangeEvent<HTMLInputElement>,
      ChangeEvent<HTMLInputElement>[]
    > = jest.fn();

    render(<PriceField onChange={onChange} />);

    userEvent.type(screen.getByRole('textbox'), '20000');

    const lastCall = onChange.mock.calls.pop()[0];
    expect(lastCall.target.value).toBe('20,000');
  });
});
