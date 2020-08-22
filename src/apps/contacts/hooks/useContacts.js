import { useRecoilState, atom } from "recoil";

const contactListState = atom({
  key: "contactList",
  default: [
    {
      id: 0,
      display: "Test Contact",
      phoneNumber: "000-1111",
    },
    {
      id: 1,
      display: "Test Contact 2",
      phoneNumber: "000-1112",
    },
  ],
});

export const useContacts = () => {
  const [contactList, setContactList] = useRecoilState(contactListState);
  return { contactList, setContactList };
};
