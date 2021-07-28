import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppContent } from '../../../ui/components/AppContent';
import { GalleryGrid } from './grid/GalleryGrid';
import { GalleryModal } from './modal/GalleryModal';
import { Route, Switch } from 'react-router-dom';
import { LoadingSpinner } from '../../../ui/components/LoadingSpinner';

const CameraApp: React.FC = () => (
  <AppWrapper id="camera-app">
    <AppContent>
      <Switch>
        <React.Suspense fallback={<LoadingSpinner />}>
          <Route path="/camera" exact component={GalleryGrid} />
          <Route path="/camera/image" exact component={GalleryModal} />
        </React.Suspense>
      </Switch>
    </AppContent>
  </AppWrapper>
);

export default CameraApp;
