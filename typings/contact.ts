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

export interface Contact {
  id: number;
  display: string;
  number: string;
  avatar?: string;
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
}
