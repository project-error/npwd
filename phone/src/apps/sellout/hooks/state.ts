import { atom } from "recoil";

export const selloutState = {
  listing: atom({
    key: "listing",
    default: [],
  })
};
