import { useEffect } from 'react';
import { useNuiRequest } from 'fivem-nui-react-lib';

export const AppWithStartup = ({ children, id }) => {
  const Nui = useNuiRequest();
  useEffect(() => {
    Nui.send(`npwd:app:${id}`);
  }, [Nui, id]);
  return children;
};
