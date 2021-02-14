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
