import { useRecoilState } from 'recoil';
import { IContactAlert } from '../../../common/typings/contact';
import { contactsState } from './state';

export const useContactAlert = (): IContactAlert => {
  const [alert, setAlert] = useRecoilState(contactsState.contactAlert);
  return { alert, setAlert };
};
