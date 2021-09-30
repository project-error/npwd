export const PHONE_NUMBER_REGEX = /^([0-9]{3}-[0-9]{4})|([0-9]{7})$/;

export enum PhoneEvents {
  OPEN_APP = 'npwd:openApp',
  OPEN_PHONE = 'npwd:open',
  CLOSE_PHONE = 'npwd:close',
  SET_VISIBILITY = 'npwd:setVisibility',
  SET_NUMBER = 'npwd:setNumber',
  SET_PHONE_READY = 'npwd:phoneReady',
  SET_CONFIG = 'npwd:setPhoneConfig',
  SET_TIME = 'npwd:setGameTime',
  SEND_CREDENTIALS = 'npwd:sendCredentials',
  FETCH_CREDENTIALS = 'npwd:getCredentials',
  ON_INIT = 'npwd:onInit',
  TOGGLE_KEYS = 'npwd:toggleAllControls',
}

// Used to standardize the server response
export enum ErrorStringKeys {
  SERVER_ERROR = 'GENERAL_SERVER_ERROR',
  DELETE_FAILED = 'DELETE_FAILED',
  ADD_FAILED = 'ADD_FAILED',
  UPDATE_FAILED = 'UPDATED_FAILED',
  FETCH_FAILED = 'FETCH_FAILED',
}

export interface FxServerRespError {
  errorCode: ErrorStringKeys;
  message: string;
}

export interface FxServerResponse {
  data?: unknown;
  action: string;
  status: 'success' | 'failure';
  app: string;
  error?: FxServerRespError;
}
