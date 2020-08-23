import { useEffect } from "react";
import { eventNameFactory } from "../utils/nuiUtils";

export const useNuiService = (options = {}) => {
  const { capture, passive, once } = options;
  const eventListener = (event) => {
    console.log(event);
    const { app, method, data } = event.data;
    if (app && method && data) {
      window.dispatchEvent(
        new MessageEvent(eventNameFactory(app, method), {
          data,
        })
      );
    }
  };
  useEffect(() => {
    const opts = { capture, passive, once };
    window.addEventListener("message", eventListener, opts);
    return () => window.removeEventListener("message", eventListener, opts);
  }, [capture, passive, once]);
};
