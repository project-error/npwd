/// <reference types="@welldone-software/why-did-you-render" />
import React from 'react';

if (import.meta.env.DEV) {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
