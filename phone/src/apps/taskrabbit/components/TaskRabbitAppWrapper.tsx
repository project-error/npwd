import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { useApp } from '@os/apps/hooks/useApps';
import { TaskRabbitThemeProvider } from '../providers/TaskRabbitThemeProvider';
import { AppTitle } from '@ui/components/AppTitle';
import { TaskRabbitApp } from './TaskRabbitApp';
import { Job } from './Job';
import { Route, Switch } from 'react-router-dom';

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
