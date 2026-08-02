import { useMemo } from 'react';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Contact, ContactEvents } from '@typings/contact';
import { buildRespObj } from '@utils/misc';
import { BrowserContactsState } from '../utils/constants';
import { fetchNuiData } from '@common/query/fetch-nui-query';
import { useQueryState, useQueryStateValue, useSetQueryState } from '@common/query/query-state';

export const CONTACTS_QUERY_KEY = ['contacts'] as const;

const fetchContacts = () =>
  fetchNuiData<Contact[]>(
    ContactEvents.GET_CONTACTS,
    undefined,
    buildRespObj(BrowserContactsState),
  ).catch((e) => {
    console.error(e);
    return [];
  });

export const showMoneyModal = atom<boolean>(false);

export const filterInput = atom<string>('');

export const useSetContacts = () => useSetQueryState<Contact[]>(CONTACTS_QUERY_KEY, []);
export const useContacts = () => useQueryState<Contact[]>(CONTACTS_QUERY_KEY, fetchContacts, []);
export const useContactsValue = () =>
  useQueryStateValue<Contact[]>(CONTACTS_QUERY_KEY, fetchContacts, []);

export const useFilteredContacts = () => {
  const contactsValue = useContactsValue();
  const filterInputVal = useAtomValue(filterInput);

  return useMemo(() => {
    if (!filterInputVal) return contactsValue;

    const regExp = new RegExp(filterInputVal, 'gi');

    return contactsValue.filter(
      (contact) => contact.display.match(regExp) || contact.number.match(regExp),
    );
  }, [contactsValue, filterInputVal]);
};

export const useContactFilterInput = () => useAtom(filterInput);
export const useSetContactFilterInput = () => useSetAtom(filterInput);