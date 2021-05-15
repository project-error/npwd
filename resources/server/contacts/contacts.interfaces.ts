import { FxServerRespError } from '../../../typings/phone';
import { ContactEvents } from '../../../typings/contact';

export interface ContactServerResp {
  data?: unknown;
  error?: FxServerRespError;
  action: ContactEvents;
}
