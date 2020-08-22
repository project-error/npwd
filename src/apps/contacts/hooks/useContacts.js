import { useRecoilState, atom } from "recoil";

const contactListState = atom({
  key: "contactList",
  default: [
    {
      display: "Test Contact",
      phoneNumber: "000-1111",
    },
    {
      display: "Test Contact 2",
      phoneNumber: "000-1112",
    },
  ],
});

export const useContacts = () => {
  const [contactList, setContactList] = useRecoilState(contactListState);
  return { contactList, setContactList };
};
