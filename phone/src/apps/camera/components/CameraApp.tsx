import React from 'react'
import { AppWrapper } from "../../../ui/components";
import { AppContent } from "../../../ui/components/AppContent";
import { usePhotoModal } from '../hooks/usePhotoModal';
import { GalleryGrid } from './grid/GalleryGrid';
import { GalleryModal } from './modal/GalleryModal';


const CameraApp = () => {

  const {modal} = usePhotoModal();

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
  )
}

export default CameraApp;
