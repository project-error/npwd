import { useRecoilState } from 'recoil';
import { contactsState } from './state';

interface FilterdContactsProps {
  filteredContacts: string;
  setFilteredContacts: (searchTerm: string) => void;
}

export const useFilteredContacts = (): FilterdContactsProps => {
  const [filteredContacts, setFilteredContacts] = useRecoilState(contactsState.filterContacts);
  return { filteredContacts, setFilteredContacts };
};
