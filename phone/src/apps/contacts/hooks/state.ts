import { atom } from "recoil";

export const contactsState = {
  contacts: atom({
    key: "contactsList",
    default: [],
  }),
  showModal: atom({
    key: "showModal",
    default: false,
  }),
  filterContacts: atom({
    key: "filterContacts",
    default: "",
  }),
};
