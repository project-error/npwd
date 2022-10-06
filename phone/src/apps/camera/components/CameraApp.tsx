import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { GalleryGrid } from './grid/GalleryGrid';
import { GalleryModal } from './modal/GalleryModal';
import { Route, Switch } from 'react-router-dom';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { AppTitle } from '@ui/components/AppTitle';
import { useApp } from '@os/apps/hooks/useApps';
import NewPhotoButton from './NewPhotoButton';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
}));

const CameraApp: React.FC = () => {
  const camera = useApp('CAMERA');
  const classes = useStyles();

  return (
    <AppWrapper id="camera-app">
      <AppTitle app={camera} />
      <AppContent className={classes.root}>
        <Switch>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Route path="/camera" exact component={GalleryGrid} />
            <Route path="/camera/image" exact component={GalleryModal} />
          </React.Suspense>
        </Switch>
      </AppContent>
      <Route exact path="/camera">
        <NewPhotoButton />
      </Route>
    </AppWrapper>
  );
};

export default CameraApp;
