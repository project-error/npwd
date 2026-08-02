import { Suspense } from 'react';
import TwitterApp from './twitter-app';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

const LifeInvaderContainer = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TwitterApp />
    </Suspense>
  );
};

export default LifeInvaderContainer;
