import { NotesEvents } from '../../typings/notes';
import { sendNotesEvent } from '../utils/messages';

onNet(NotesEvents.SEND_NOTE, (notes: any) => {
  sendNotesEvent('setNotes', notes);
});

RegisterNuiCallbackType(NotesEvents.ADD_NOTE);
on(`__cfx_nui:${NotesEvents.ADD_NOTE}`, (data: any) => {
  emitNet(NotesEvents.ADD_NOTE, data);
});

onNet(NotesEvents.SEND_NOTE_SUCCESS, () => {
  emitNet(NotesEvents.FETCH_ALL_NOTES);
});

onNet(NotesEvents.DELETE_NOTE_SUCCESS, () => {
  emitNet(NotesEvents.FETCH_ALL_NOTES);
});

RegisterNuiCallbackType(NotesEvents.DELETE_NOTE);
on(`__cfx_nui:${NotesEvents.DELETE_NOTE}`, (data: any) => {
  emitNet(NotesEvents.DELETE_NOTE, data);

  emitNet(NotesEvents.FETCH_ALL_NOTES);
});

RegisterNuiCallbackType(NotesEvents.UPDATE_NOTE);
on(`__cfx_nui:${NotesEvents.UPDATE_NOTE}`, (data: any) => {
  emitNet(NotesEvents.UPDATE_NOTE, data);
});

onNet(NotesEvents.UPDATE_NOTE_SUCCESS, () => {
  emitNet(NotesEvents.FETCH_ALL_NOTES);
});

onNet(NotesEvents.ACTION_RESULT, (alert: any) => {
  sendNotesEvent('setAlert', alert);
});
