import { memo, useEffect } from 'react';
import { useNuiRequest } from 'fivem-nui-react-lib';

const Component = ({ children, id, emitOnOpen }) => {
  const Nui = useNuiRequest();
  useEffect(() => {
    if (emitOnOpen) Nui.send(`npwd:app:${id}`);
  }, [Nui, id, emitOnOpen]);
  return children;
};

const AppWithStartup = memo(Component, () => true);

export { AppWithStartup };
