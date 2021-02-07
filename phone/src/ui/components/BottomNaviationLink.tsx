import React from 'react';
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

export const BottomNavigationLink = (props) =>
  forwardRef((linkProps, ref) => <Link ref={ref} {...linkProps} {...props} />);
