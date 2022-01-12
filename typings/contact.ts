export type AlertCategory =
  | 'CONTACT_ADD_SUCCESS'
  | 'CONTACT_ADD_FAILED'
  | 'CONTACT_UPDATE_SUCCESS'
  | 'CONTACT_UPDATE_FAILED'
  | 'CONTACT_DELETE_SUCCESS'
  | 'CONTACT_DELETE_FAILED';

export interface PreDBContact {
  display: string;
  number: string;
  avatar?: string;
}

export interface Contact extends PreDBContact {
  id: number;
}

export interface ContactDeleteDTO {
  id: number;
}

export enum ContactResp {
  ADD_FAILED = 'CONTACT.FEEDBACK.ADD_FAILED',
  UPDATE_FAILED = 'CONTACT.FEEDBACK.UPDATE_FAILED',
  INVALID_HOST = 'GENERIC_INVALID_IMAGE_HOST',
}

export enum ContactsDatabaseLimits {
  avatar = 255,
  number = 20,
  display = 255,
}

export enum ContactEvents {
  GET_CONTACTS = 'npwd:getContacts',
  ADD_CONTACT = 'npwd:addContacts',
  UPDATE_CONTACT = 'npwd:updateContact',
  DELETE_CONTACT = 'npwd:deleteContact',
  // Used to fill in information through an export event
  ADD_CONTACT_EXPORT = 'npwd:addContactExport',
}

export interface AddContactExportData {
  name?: string;
  number: string;
  avatar?: string;
}
