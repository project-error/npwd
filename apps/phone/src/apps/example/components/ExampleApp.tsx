import React from 'react';
import { Button } from '@ui/components/Button';
import { useExampleStringValue } from '../hooks/state';
import { useApp } from '@os/apps/hooks/useApps';

export const ExampleApp: React.FC = () => {
  const exampleString = useExampleStringValue();

  const example = useApp('EXAMPLE');

  return (
    <div className="h-full w-full p-4">
      <h1 className="text-3xl font-semibold text-keyos-fg">Welcome to NPWD!</h1>
      <Button color="primary">{example.id}</Button>
      <h3 className="text-keyos-fg">{exampleString}</h3>
    </div>
  );
};
