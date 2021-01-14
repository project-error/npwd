import { useRecoilState } from 'recoil';
import { ContactProps } from '../../../common/typings/contact';
import { contactsState } from './state';

interface ContactDetailProps {
  contactDetail: ContactProps;
  setContactDetail: (contact: object) => void;
}


 
export const useContactDetail = (): ContactDetailProps => {
  const [ contactDetail, setContactDetail ] = useRecoilState(contactsState.contactDetail);
  return { contactDetail, setContactDetail };
};
