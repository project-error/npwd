import { Note, NotesEvents } from '../../typings/notes';
import { sendNotesEvent } from '../utils/messages';

onNet(NotesEvents.SEND_NOTE, (notes: any) => {
  sendNotesEvent(NotesEvents.SEND_NOTE, notes);
});

RegisterNuiCallbackType(NotesEvents.ADD_NOTE);
on(`__cfx_nui:${NotesEvents.ADD_NOTE}`, (note: Note) => {
  emitNet(NotesEvents.ADD_NOTE, note);
});

RegisterNuiCallbackType(NotesEvents.DELETE_NOTE);
on(`__cfx_nui:${NotesEvents.DELETE_NOTE}`, (noteId: number) => {
  emitNet(NotesEvents.DELETE_NOTE, noteId);
});

RegisterNuiCallbackType(NotesEvents.UPDATE_NOTE);
on(`__cfx_nui:${NotesEvents.UPDATE_NOTE}`, (note: Note) => {
  emitNet(NotesEvents.UPDATE_NOTE, note);
});

onNet(NotesEvents.SEND_NOTE_SUCCESS, () => {
  emitNet(NotesEvents.FETCH_ALL_NOTES);
});

onNet(NotesEvents.UPDATE_NOTE_SUCCESS, () => {
  emitNet(NotesEvents.FETCH_ALL_NOTES);
});

onNet(NotesEvents.ACTION_RESULT, (alert: any) => {
  sendNotesEvent(NotesEvents.SEND_ALERT, alert);
});

onNet(NotesEvents.DELETE_NOTE_SUCCESS, () => {
  emitNet(NotesEvents.FETCH_ALL_NOTES);
});
