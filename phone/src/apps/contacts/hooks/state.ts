import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Contact, ContactEvents } from '../../../../../typings/contact';
import { fetchNui } from '../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../typings/common';
import { isEnvBrowser } from '../../../utils/misc';
import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import { BrowserContactsState } from '../utils/constants';

export const contactsState = {
  contacts: atom<Contact[]>({
    key: 'contactsList',
    default: selector({
      key: 'contactsListDefault',
      get: async () => {
        try {
          const resp = await fetchNui<ServerPromiseResp<Contact[]>>(ContactEvents.GET_CONTACTS);
          LogDebugEvent({ action: 'ContactsFetched', data: resp.data });
          return resp.data;
        } catch (e) {
          if (isEnvBrowser()) {
            return BrowserContactsState;
          }
          console.error(e);
          return [];
        }
      },
    }),
  }),
  filterInput: atom<string>({
    key: 'filterInput',
    default: '',
  }),
  filteredContacts: selector({
    key: 'filteredContacts',
    get: ({ get }) => {
      const filterInputVal: string = get(contactsState.filterInput);
      const contacts: Contact[] = get(contactsState.contacts);

      if (!filterInputVal) return contacts;

      const regExp = new RegExp(filterInputVal, 'gi');

      return contacts.filter(
        (contact) => contact.display.match(regExp) || contact.number.match(regExp),
      );
    },
  }),
};

export const useSetContacts = () => useSetRecoilState(contactsState.contacts);
export const useContacts = () => useRecoilState(contactsState.contacts);
export const useContactsValue = () => useRecoilValue(contactsState.contacts);

export const useFilteredContacts = () => useRecoilValue(contactsState.filteredContacts);

export const useContactFilterInput = () => useRecoilState(contactsState.filterInput);
export const useSetContactFilterInput = () => useSetRecoilState(contactsState.filterInput);
