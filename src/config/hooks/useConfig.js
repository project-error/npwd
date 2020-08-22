import { createContext, useContext, useEffect, useState } from "react";
import _set from "lodash/set";
import Default from "../default.json";

export const ConfigContext = createContext(Default);

export const useConfig = (Context = ConfigContext) => {
  const configCtx = useContext(Context);
  const [config, _setConfig] = useState({ ...configCtx });

  useEffect(() => {
    _setConfig({ ...configCtx });
  }, [configCtx]);

  const setConfig = (key, value) => {
    const state = { ...config };
    _setConfig(_set(state, key, value));
  };
  return [config, setConfig];
};
