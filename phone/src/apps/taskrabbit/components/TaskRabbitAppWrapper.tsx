import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { useApp } from '@os/apps/hooks/useApps';
import { TaskRabbitThemeProvider } from '../providers/TaskRabbitThemeProvider';
import { AppTitle } from '@ui/components/AppTitle';
import { TaskRabbitApp } from './TaskRabbitApp';
import { Job } from './Job';
import { Route, Switch } from 'react-router-dom';

// AppContent by default has a React.Suspense which can be used to handle the app as a whole, for
// when it must resolve the render promise. But, we must make sure that this is is mounted in a component
// higher in the tree than the Recoil state caller.

// This is why this wrapper component is needed.
export const TaskRabbitAppWrapper: React.FC = () => {
  const example = useApp('TASKRABBIT');
  return (
    <TaskRabbitThemeProvider>
      <AppWrapper>
        <AppTitle app={example} />
        <AppContent>
            <Switch>
              <Route path="/taskrabbit" exact component={TaskRabbitApp} />
              <Route path="/taskrabbit/job" exact component={Job} />
            </Switch>
        </AppContent>
      </AppWrapper>
    </TaskRabbitThemeProvider>
  );
};
