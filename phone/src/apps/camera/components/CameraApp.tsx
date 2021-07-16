import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppContent } from '../../../ui/components/AppContent';
import { GalleryGrid } from './grid/GalleryGrid';
import { GalleryModal } from './modal/GalleryModal';
import InjectDebugData from '../../../os/debug/InjectDebugData';
import { Route, Switch } from 'react-router-dom';
import { PhotoEvents } from '../../../../../typings/photo';
import { LoadingSpinner } from '../../../ui/components/LoadingSpinner';

InjectDebugData([
  {
    app: 'CAMERA',
    method: PhotoEvents.SEND_PHOTOS,
    data: [
      {
        id: 1,
        image: 'https://i.file.glass/noDcb.jpeg',
      },
      {
        id: 2,
        image: 'https://i.file.glass/teUcY.jpeg',
      },
    ],
  },
]);

const CameraApp = () => {
  return (
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
};

export default CameraApp;
