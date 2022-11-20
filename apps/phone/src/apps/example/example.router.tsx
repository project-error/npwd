import { createAppRouter } from '@os/router';
import { ExampleApp } from './components/ExampleApp';

export const exampleAppRouter = createAppRouter([
  {
    path: '/example',
    Component: <ExampleApp />,
  },
  {
    path: '/example/3',
    Component: <h1>Hello world</h1>,
  },
]);
