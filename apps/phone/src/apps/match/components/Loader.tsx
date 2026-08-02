import React from 'react';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

function Loader() {
  return (
    <div className="flex h-full w-full justify-center">
      <LoadingSpinner height={60} className="mt-[140px]" />
    </div>
  );
}

export default Loader;
