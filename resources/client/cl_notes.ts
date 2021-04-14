import { Note, NoteServerResponse, NotesEvents } from '../../typings/notes';
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

// Trying out this response structure
onNet(
  NotesEvents.SERVER_RESP,
  ({ alert, action, suceeded, refetch, data }: NoteServerResponse<Note[] | Note>) => {
    if (alert) {
      sendNotesEvent(NotesEvents.SEND_ALERT, alert);
    }

    switch (action) {
      case 'SEND':
        sendNotesEvent(NotesEvents.SEND_NOTE, data);
        break;
    }

    if (refetch && suceeded) {
      emitNet(NotesEvents.FETCH_ALL_NOTES);
    }
  },
);
