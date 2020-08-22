import React from 'react';
import { AppWrapper } from '../../../ui/components';

export const HomeApp = ({}) => {
    return <AppWrapper style={{backgroundImage: `${process.env.PUBLIC_URL}url(/media/backgrounds/default.png)` }}>Home!</AppWrapper>
};
