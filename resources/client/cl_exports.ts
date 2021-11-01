import { sendContactsEvent, sendMessage, sendNotesEvent } from '../utils/messages';
import { PhoneEvents } from '../../typings/phone';
import { verifyExportArgType } from './cl_utils';
import { initializeCallHandler } from './calls/cl_calls.controller';
import { AddContactExportData, ContactEvents } from '../../typings/contact';
import { AddNoteExportData, NotesEvents } from '../../typings/notes';
import { hidePhone, showPhone } from './cl_main';

const exps = global.exports;

// Will open an app based on ID
exps('openApp', (app: string) => {
  verifyExportArgType('openApp', app, ['string']);

  sendMessage('PHONE', PhoneEvents.OPEN_APP, app);
});

// Will set the phone to open or closed based on based value
exps('setPhoneVisible', async (bool: boolean | number) => {
  verifyExportArgType('setPhoneVisible', bool, ['boolean', 'number']);

  const isPhoneDisabled = (global as any).isPhoneDisabled;
  const isPhoneOpen = (global as any).isPhoneOpen;
  // We need to make sure that the phone isn't disabled before we use the setter
  if (isPhoneDisabled && !bool && isPhoneOpen) return;

  const coercedType = !!bool;

  if (coercedType) await showPhone();
  else await hidePhone();
});

// Getter equivalent of above
exps('isPhoneVisible', () => (global as any).isPhoneOpen);

// Will prevent the phone from being opened
exps('setPhoneDisabled', (bool: boolean | number) => {
  verifyExportArgType('setPhoneVisible', bool, ['boolean', 'number']);
  const coercedType = !!bool;
  (global as any).isPhoneDisabled = coercedType;
});

exps('isPhoneDisabled', () => (global as any).isPhoneDisabled);

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
  verifyExportArgType('fillNewNOte', noteData, ['object']);
  sendNotesEvent(NotesEvents.ADD_NOTE_EXPORT, noteData);
});
