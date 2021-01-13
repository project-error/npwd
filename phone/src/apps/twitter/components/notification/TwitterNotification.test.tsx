import React from 'react';
import { shallow } from 'enzyme';
import TwitterNotification from './TwitterNotification';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock('../../../../os/phone/hooks/usePhone', () => ({
  usePhone: jest.fn().mockReturnValue({
    config: {
      twitter: {
        showNotifications: true,
      },
    },
  }),
}));

jest.mock('../../hooks/useTwitterNotification', () => ({
  useTwitterNotification: jest.fn().mockReturnValue({
    notification: {
      profile_name: 'test',
      message: 'test message',
    },
  }),
}));

describe('TwitterNotification', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<TwitterNotification />);
  });
  it('renders', () => {
    expect(wrapper).toBeDefined();
  });

  it('renders profile name', () => {
    expect(wrapper.find('.makeStyles-profileName-5').text()).toEqual('@test');
  });

  it('renders message', () => {
    expect(wrapper.find('.makeStyles-message-7').text()).toEqual(
      'test message'
    );
  });
});
