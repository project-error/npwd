import { Suspense } from 'react';
import TwitterApp from './TwitterApp';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

const TwitterContainer = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TwitterApp />
    </Suspense>
  );
};

export default TwitterContainer;
