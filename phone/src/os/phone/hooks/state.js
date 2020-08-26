import { atom } from "recoil";

export const phoneState = {
  visibility: atom({
    key: "phoneVisibility",
    default: false,
  }),
  powerOff: atom({
    key: "phonePowerOff",
    default: true,
  }),
};
