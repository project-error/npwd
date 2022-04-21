export interface IAlertProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export enum AlertEvents {
  PLAY_ALERT = 'npwd:playAlert',
}
