
import { useEffect, useRef } from "react";
import { eventNameFactory } from "../utils/nuiUtils";

interface IOptions {
  capture?: boolean;
  passive?: boolean;
  once?: boolean;
}

export const useNuiEvent = (app: any, method: any, handler: any, options: IOptions = {}) => {
  const savedHandler: any = useRef();
  const { capture, passive, once } = options;

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventName = eventNameFactory(app, method);
    const eventListener = (event: any ) => {
      if (savedHandler.current && savedHandler.current.call) {
        const { data } = event;
        console.log(eventName, data);
        savedHandler.current(data);
      }
    };
    const opts = { capture, passive, once };
    window.addEventListener(eventName, eventListener, opts);
    return () => window.removeEventListener(eventName, eventListener, opts);
  }, [app, method, capture, passive, once]);
};