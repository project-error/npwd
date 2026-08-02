import { useEffect } from 'react';
import fetchNui from '@utils/fetchNui';

const Component = ({ children, id, emitOnOpen }) => {
  useEffect(() => {
    if (emitOnOpen) fetchNui(`npwd:app:${id}`, undefined, {});
  }, [id, emitOnOpen]);

  return children;
};

const AppWithStartup = Component;

export { AppWithStartup };
