import { NotificationsProvider } from '@os/notifications/providers/NotificationsProvider';
import Phone from './Phone';

export const PhoneProviders = () => {
  return (
    <NotificationsProvider>
      <Phone />
    </NotificationsProvider>
  );
};
