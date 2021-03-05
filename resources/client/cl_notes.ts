import { sendNotesEvent } from '../utils/messages';
import { NotesNetEvents } from '../../phone/src/common/typings/notes';

onNet(NotesNetEvents.SEND_NOTE, (notes: any) => {
  sendNotesEvent('setNotes', notes);
});

RegisterNuiCallbackType(NotesNetEvents.ADD_NOTE);
on(`__cfx_nui:${NotesNetEvents.ADD_NOTE}`, (data: any) => {
  emitNet(NotesNetEvents.ADD_NOTE, data);
});

onNet(NotesNetEvents.SEND_NOTE_SUCCESS, () => {
  emitNet(NotesNetEvents.FETCH_ALL_NOTES);
});

RegisterNuiCallbackType(NotesNetEvents.DELETE_NOTE);
on(`__cfx_nui:${NotesNetEvents.DELETE_NOTE}`, (data: any) => {
  emitNet(NotesNetEvents.DELETE_NOTE, data);

  emitNet(NotesNetEvents.FETCH_ALL_NOTES);
});

RegisterNuiCallbackType(NotesNetEvents.UPDATE_NOTE);
on(`__cfx_nui:${NotesNetEvents.UPDATE_NOTE}`, (data: any) => {
  emitNet(NotesNetEvents.UPDATE_NOTE, data);
});

onNet(NotesNetEvents.UPDATE_NOTE_SUCCESS, () => {
  emitNet(NotesNetEvents.FETCH_ALL_NOTES);
});

onNet(NotesNetEvents.ACTION_RESULT, (alert: any) => {
  sendNotesEvent('setAlert', alert);
});
