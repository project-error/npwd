import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Contact, ContactEvents } from '@typings/contact';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { buildRespObj } from '@utils/misc';
import { BrowserContactsState } from '../utils/constants';

export const contacts = atom<Contact[]>({
  key: 'contactsList',
  default: selector({
    key: 'contactsListDefault',
    get: async () => {
      try {
        const resp = await fetchNui<ServerPromiseResp<Contact[]>>(
          ContactEvents.GET_CONTACTS,
          undefined,
          buildRespObj(BrowserContactsState),
        );
        return resp.data;
      } catch (e) {
        console.error(e);
        return [];
      }
    },
  }),
});

export const filterInput = atom<string>({
  key: 'filterInput',
  default: '',
});

export const filteredContacts = selector({
  key: 'filteredContacts',
  get: ({ get }) => {
    const filterInputVal: string = get(filterInput);
    const contactsValue = get(contacts);

    if (!filterInputVal) return contacts;

    const regExp = new RegExp(filterInputVal, 'gi');

    return contactsValue.filter(
      (contact) => contact.display.match(regExp) || contact.number.match(regExp),
    );
  },
});

export const useSetContacts = () => useSetRecoilState(contacts);
export const useContacts = () => useRecoilState(contacts);
export const useContactsValue = () => useRecoilValue(contacts);

export const useFilteredContacts = () => useRecoilValue(filteredContacts);

export const useContactFilterInput = () => useRecoilState(filterInput);
export const useSetContactFilterInput = () => useSetRecoilState(filterInput);
