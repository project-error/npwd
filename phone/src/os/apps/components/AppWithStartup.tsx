import { memo, useEffect } from 'react';
import { useNuiRequest } from 'fivem-nui-react-lib';

const Component = ({ children, id }) => {
  const Nui = useNuiRequest();
  useEffect(() => {
    Nui.send(`npwd:app:${id}`);
  }, [Nui, id]);
  return children;
};

const AppWithStartup = memo(Component, () => true);

export { AppWithStartup };
