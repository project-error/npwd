import { sendContactsEvent, sendMessage, sendNotesEvent, sendPhoneEvent } from '../utils/messages';
import { PhoneEvents } from '../../typings/phone';
import { verifyExportArgType } from './cl_utils';
import { initializeCallHandler } from './calls/cl_calls.controller';
import { AddContactExportData, ContactEvents } from '../../typings/contact';
import { AddNoteExportData, NotesEvents } from '../../typings/notes';
import { hidePhone, showPhone } from './cl_main';
import { ClUtils } from './client';
import { CallService, callService } from './calls/cl_calls.service';
import { animationService } from './animations/animation.controller';
import { CallEvents } from '../../typings/call';

const exps = global.exports;

// Will open an app based on ID
exps('openApp', (app: string) => {
  verifyExportArgType('openApp', app, ['string']);

  sendMessage('PHONE', PhoneEvents.OPEN_APP, app);
});

// Will set the phone to open or closed based on based value
exps('setPhoneVisible', async (bool: boolean | number) => {
  verifyExportArgType('setPhoneVisible', bool, ['boolean', 'number']);

  const isPhoneDisabled = global.isPhoneDisabled;
  const isPhoneOpen = global.isPhoneOpen;
  // We need to make sure that the phone isn't disabled before we use the setter
  if (isPhoneDisabled && !bool && isPhoneOpen) return;

  const coercedType = !!bool;

  if (coercedType) await showPhone();
  else await hidePhone();
});

// Getter equivalent of above
exps('isPhoneVisible', () => global.isPhoneOpen);

// Will prevent the phone from being opened
exps('setPhoneDisabled', (bool: boolean | number) => {
  verifyExportArgType('setPhoneVisible', bool, ['boolean', 'number']);
  const coercedType = !!bool;
  global.isPhoneDisabled = coercedType;
  sendPhoneEvent(PhoneEvents.IS_PHONE_DISABLED, bool);
});

exps('isPhoneDisabled', () => global.isPhoneDisabled);

// Takes in a number to start the call with
exps('startPhoneCall', (number: string) => {
  verifyExportArgType('startPhoneCall', number, ['string']);

  initializeCallHandler({ receiverNumber: number });
});

// Will automatically open the contacts app start the new contact process
// filling in all of the fields with passed data. If this number already exists,
// it will edit it.
//
// Data Struct
// interface AddContactExportData {
//   name?: string;
//   number: string;
//   avatar?: string;
// }
exps('fillNewContact', (contactData: AddContactExportData) => {
  verifyExportArgType('fillNewContact', contactData, ['object']);
  sendContactsEvent(ContactEvents.ADD_CONTACT_EXPORT, contactData);
});

// Will automatically open the notes app and start the new note process
// filling in all of the fields with passed data. If this number already exists,
// it will edit it.
//
// Data Struct
// interface AddNoteExportData {
//   title?: string;
//   content?: string;
// }
exps('fillNewNote', (noteData: AddNoteExportData) => {
  verifyExportArgType('fillNewNote', noteData, ['object']);
  sendNotesEvent(NotesEvents.ADD_NOTE_EXPORT, noteData);
});

exps('getPhoneNumber', async () => {
  if (!global.clientPhoneNumber) {
    const res = await ClUtils.emitNetPromise(PhoneEvents.GET_PHONE_NUMBER);
    global.clientPhoneNumber = res.data;
  }
  return global.clientPhoneNumber;
});

exps('isInCall', () => {
  return callService.isInCall();
});

exps('endCall', async () => {
  if (callService.isInCall()) {
    CallService.sendCallAction(CallEvents.END_CALL, null);
    animationService.endPhoneCall();
  }
});
