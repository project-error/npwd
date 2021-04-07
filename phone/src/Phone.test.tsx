import React from 'react';
import { RecoilRoot } from 'recoil';
import { shallow } from 'enzyme';
import { PhoneContainer } from './PhoneContainer';

it('renders Phone', () => {
  shallow(
    <RecoilRoot>
      <PhoneContainer />
    </RecoilRoot>,
  );
});
