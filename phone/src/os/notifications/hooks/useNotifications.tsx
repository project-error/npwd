import { useContext } from 'react';
import { NotificationsContext } from '../providers/NotificationsProvider';

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      'useNotifications must be wrapped by NotificationsProvider'
    );
  }
  return context;
};
