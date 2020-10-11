import { atom } from "recoil";

export const simcardState = {
  number: atom({
    key: "simcardNumber",
    default: null,
  }),
};
