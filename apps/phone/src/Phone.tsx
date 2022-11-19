import React, { Fragment, useEffect } from 'react';
import './Phone.css';
import { Route, Routes } from 'react-router-dom';
import { HomeApp } from './apps/home/components/Home';
import { Navigation } from '@os/navigation-bar/components/Navigation';
import InjectDebugData from './os/debug/InjectDebugData';
import { PhoneEvents } from '@typings/phone';
import PhoneWrapper from './PhoneWrapper';
import DefaultConfig from '../../../config.json';
import { TopLevelErrorComponent } from '@ui/components/TopLevelErrorComponent';
import { useApps } from '@os/apps/hooks/useApps';

const Phone: React.FC = () => {
  const { apps } = useApps();

  return (
    <div>
      <TopLevelErrorComponent>
        <PhoneWrapper>
          <div className="PhoneAppContainer" id="notificationAppContainer">
            <>
              <Routes>
                <Route path="/" element={<HomeApp />} />
                {apps.map((App) => (
                  <Route path={App.path} element={App.Component} />
                ))}
              </Routes>
            </>
          </div>
          <Navigation />
        </PhoneWrapper>
      </TopLevelErrorComponent>
    </div>
  );
};

InjectDebugData<any>([
  {
    app: 'PHONE',
    method: PhoneEvents.SET_CONFIG,
    data: DefaultConfig,
  },
  {
    app: 'PHONE',
    method: PhoneEvents.SET_VISIBILITY,
    data: true,
  },
]);

export default Phone;
