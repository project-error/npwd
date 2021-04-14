export type AlertCategory =
  | 'CONTACT_ADD_SUCCESS'
  | 'CONTACT_ADD_FAILED'
  | 'CONTACT_UPDATE_SUCCESS'
  | 'CONTACT_UPDATE_FAILED'
  | 'CONTACT_DELETE_SUCCESS'
  | 'CONTACT_DELETE_FAILED';

export interface IContactAlert {
  alert: AlertCategory;
  setAlert: (type: string) => void;
}

export interface PreDBContact {
  display: string;
  number: string;
  avatar?: string;
}

export interface Contact extends PreDBContact {
  id: number;
}

export enum ContactEvents {
  SEND_CONTACTS = 'npwd:sendContacts',
  GET_CONTACTS = 'npwd:getContacts',
  ADD_CONTACT = 'npwd:addContacts',
  ADD_CONTACT_SUCCESS = 'contacts:addSuccess',
  UPDATE_CONTACT = 'npwd:updateContact',
  DELETE_CONTACT = 'npwd:deleteContact',
  DELETE_CONTACT_SUCCESS = 'npwd:deleteSuccess',
  UPDATE_CONTACT_SUCCESS = 'npwd:updateContactSuccess',
  ACTION_RESULT = 'npwd:contactActionResult',
  SEND_ALERT = 'npwd:contactSetAlert',
  MAIN_CLIENT_LISTER = 'npwd:contactMainListener',
}
