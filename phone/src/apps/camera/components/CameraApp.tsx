import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppContent } from '../../../ui/components/AppContent';
import { GalleryGrid } from './grid/GalleryGrid';
import { GalleryModal } from './modal/GalleryModal';
import InjectDebugData from '../../../os/debug/InjectDebugData';
import { Route, Switch } from 'react-router-dom';

InjectDebugData([
  {
    app: 'CAMERA',
    method: 'setPhotos',
    data: [
      {
        id: 1,
        image: 'https://beta.iodine.gg/noDcb.jpeg',
      },
      {
        id: 2,
        image: 'https://beta.iodine.gg/teUcY.jpeg',
      },
    ],
  },
]);

const CameraApp = () => {
  return (
    <AppWrapper id="camera-app">
      <AppContent>
        <Switch>
          <Route path="/camera" exact component={GalleryGrid} />
          <Route path="/camera/image" exact component={GalleryModal} />
        </Switch>
      </AppContent>
    </AppWrapper>
  );
};

export default CameraApp;
