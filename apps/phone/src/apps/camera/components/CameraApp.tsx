import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { GalleryGrid } from './grid/GalleryGrid';
import { GalleryModal } from './modal/GalleryModal';
import { Route, Routes } from 'react-router-dom';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { AppTitle } from '@ui/components/AppTitle';
import { useApp } from '@os/apps/hooks/useApps';
import NewPhotoButton from './NewPhotoButton';

const CameraApp: React.FC = () => {
  const camera = useApp('CAMERA');

  return (
    <AppWrapper id="camera-app">
      <AppTitle app={camera} />
      <AppContent>
        <Routes>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Route path="/camera" element={<GalleryGrid />} />
            <Route path="/camera/image" element={<GalleryModal />} />
          </React.Suspense>
        </Routes>
      </AppContent>
      {/*<Route path="/camera">
        <NewPhotoButton />
      </Route>*/}
    </AppWrapper>
  );
};

export default CameraApp;
