import { atom } from "recoil";

export const contactsState = {
  contacts: atom({
    key: "contactsList",
    default: [],
  }),
};
