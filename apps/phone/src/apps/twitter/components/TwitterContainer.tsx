import { Suspense } from 'react';
import TwitterApp from './TwitterApp';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

const LifeInvaderContainer = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TwitterApp />
    </Suspense>
  );
};

export default LifeInvaderContainer;