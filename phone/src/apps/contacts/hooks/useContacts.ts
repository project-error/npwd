import { useRecoilValue } from 'recoil';
import { contactsState } from './state';

import { ContactProps } from '../../../common/typings/contact';

interface IUseContacts {
  contacts: ContactProps[]

}

export const useContacts = (): IUseContacts => {
  const contacts = useRecoilValue(contactsState.contacts);
  return { contacts };
};
