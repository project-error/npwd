import { useRecoilState } from 'recoil';
import { contactsState } from './state';

export const useFilteredContacts = () => {
  const [ filteredContacts, setFilteredContacts ] = useRecoilState(contactsState.filterContacts);
  return { filteredContacts, setFilteredContacts };
}