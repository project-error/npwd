import { Contact } from '../../../shared/Types';
import { instance } from '../utils/fetch';

export const getContacts = async () => {
  return await instance.post<{ payload: Contact[] }>('/contacts/all').then((res) => res.data);
};

export const createContact = async (name: string, phoneNumber: string) => {
  return await instance
    .post<{ payload: Contact }>('/contacts/add', { name, phoneNumber })
    .then((res) => res.data);
};
