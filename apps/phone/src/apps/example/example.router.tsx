import { createAppRouter } from '@os/router';
import { Route } from 'react-router-dom';
import { ExampleApp } from './components/ExampleApp';

export const exampleAppRouter = createAppRouter([
  {
    path: '/example',
    Route: <Route path="/example" element={<ExampleApp />} />,
  },
  {
    path: '/example/3',
    Route: <Route path="/example/3" element={<h1>Hello world</h1>} />,
  },
]);
