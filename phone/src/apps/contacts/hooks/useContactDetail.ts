import { useRecoilState } from 'recoil';
import { contactsState } from './state';

export const useContactDetail = (): any => {
  const [contactDetail, setContactDetail] = useRecoilState(
    contactsState.contactDetail
  );
  return { contactDetail, setContactDetail };
};
