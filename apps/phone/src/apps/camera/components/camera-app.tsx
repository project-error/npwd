import React from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { GalleryGrid } from './grid/GalleryGrid';
import { GalleryModal } from './modal/GalleryModal';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { AppTitle } from '@ui/components/AppTitle';
import { useApp } from '@os/apps/hooks/useApps';
import NewPhotoButton from './NewPhotoButton';

const CameraApp: React.FC = () => {
  const camera = useApp('CAMERA');
  const { pathname } = useLocation();

  return (
    <AppWrapper id="camera-app">
      <AppTitle app={camera} />
      <AppContent>
        <React.Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/camera" element={<GalleryGrid />} />
            <Route path="/camera/image" element={<GalleryModal />} />
          </Routes>
        </React.Suspense>
      </AppContent>
      {pathname === '/camera' && <NewPhotoButton />}
    </AppWrapper>
  );
};

export default CameraApp;
