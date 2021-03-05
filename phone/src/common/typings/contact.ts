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

export enum ContactNetEvents {
  SEND_CONTACTS = 'phone:sendContacts',
  GET_CONTACTS = 'phone:getContacts',
  ADD_CONTACT_NUI = 'contacts:add',
  ADD_CONTACT = 'phone:addContacts',
  ADD_CONTACT_SUCCESS = 'contacts:addSuccess',
  UPDATE_CONTACT = 'phone:updateContact',
  DELETE_CONTACT = 'phone:deleteContact',
  DELETE_CONTACT_SUCCESS = 'contacts:deleteSuccess',
  UPDATE_CONTACT_SUCCESS = 'phone:updateContactSuccess',
  ACTION_RESULT = 'phone:contactActionResult',
}
