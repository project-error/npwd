import { Suspense } from 'react';
import LifeInvaderApp from './LifeInvaderApp';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

const LifeInvaderContainer = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LifeInvaderApp />
    </Suspense>
  );
};

export default LifeInvaderContainer;