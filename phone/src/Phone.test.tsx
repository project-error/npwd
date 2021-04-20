import React from 'react';
import { RecoilRoot } from 'recoil';
import { shallow } from 'enzyme';
import { PhoneProviders } from './PhoneProviders';

it('renders Phone', () => {
  shallow(
    <RecoilRoot>
      <PhoneProviders />
    </RecoilRoot>,
  );
});
