import { atom } from "recoil";

export const callerState = {
  caller: atom({
    key: "callerList",
    default: [],
  }),
};
