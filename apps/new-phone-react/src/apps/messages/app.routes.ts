import { MessagesLayout } from './screens/Layout';
import { AppNavigation } from '@navigation/navigator';
import { Messages } from './screens/Messages';

export default {
  name: 'Messaegs',
  path: '/messages',
  Component: MessagesLayout,
  children: [
    {
      index: true,
      Component: Messages,
    },
  ],
} satisfies AppNavigation;
