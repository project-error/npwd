import { useEffect, useRef } from "react";
import { eventNameFactory } from "../utils/nuiUtils";

export const useNuiEvent = (app, method, handler, options = {}) => {
  const savedHandler = useRef();
  const { capture, passive, once } = options;

  useEffect(() => {
    savedHandler.current = event => {
      const { data } = event;
      if (handler && handler.call) {
        handler(data);
      }
    };
  }, [handler]);

  useEffect(() => {
    const eventListener = (event) => savedHandler.current(event);
    const opts = { capture, passive, once };
    const eventName = eventNameFactory(app, method);
    window.addEventListener(eventName, eventListener, opts);
    return () => window.removeEventListener(eventName, eventListener, opts);
  }, [app, method, capture, passive, once]);
};
