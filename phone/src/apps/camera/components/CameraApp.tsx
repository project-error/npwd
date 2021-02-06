import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppContent } from '../../../ui/components/AppContent';
import { usePhotoModal } from '../hooks/usePhotoModal';
import { GalleryGrid } from './grid/GalleryGrid';
import { GalleryModal } from './modal/GalleryModal';
import InjectDebugData from '../../../os/debug/InjectDebugData';

InjectDebugData([
  {
    app: 'CAMERA',
    method: 'setPhotos',
    data: [
      {
        id: 1,
        image: 'https://i.imgur.com/OO8wx6Z.jpg',
      },
      {
        id: 1,
        image: 'https://i.imgur.com/pqGBiST.jpg',
      },
    ],
  },
]);

const CameraApp = () => {
  const { modal } = usePhotoModal();

  return (
    <AppWrapper id='camera-app'>
      <AppContent>
        <GalleryModal />
        {/*<Router>
          <Switch>
            <Route path="/camera/image" component={GalleryModal} />
            <Route path="/" exact component={GalleryGrid} />
          </Switch>
        </Router>*/}
        {!modal ? <GalleryGrid /> : null}
      </AppContent>
    </AppWrapper>
  );
};

export default CameraApp;
