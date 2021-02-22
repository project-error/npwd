import { useEffect } from 'react';
import Nui from '../../nui-events/utils/Nui';

export const AppWithStartup = ({ children, id }) => {
  useEffect(() => {
    Nui.send(`phone:app:${id}`);
  }, [id]);
  return children;
};
