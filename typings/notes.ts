export type AlertCategory =
  | 'NOTES_ADD_SUCCESS'
  | 'NOTES_ADD_FAILED'
  | 'NOTES_UPDATE_SUCCESS'
  | 'NOTES_UPDATE_FAILED'
  | 'NOTES_DELETE_SUCCESS'
  | 'NOTES_DELETE_FAILED';

export interface INotesAlert {
  alert: AlertCategory;
  setAlert: (type: AlertCategory) => void;
}

export interface Note {
  id?: number;
  title: string;
  content: string;
}

export interface NoteId {
  id: number;
}

export enum NotesEvents {
  ADD_NOTE = 'npwd:addNote',
  FETCH_ALL_NOTES = 'npwd:fetchAllNotes',
  SEND_NOTE = 'npwd:sendNote',
  SEND_NOTE_SUCCESS = 'npwd:sendNoteSuccess',
  DELETE_NOTE = 'npwd:deleteNote',
  DELETE_NOTE_SUCCESS = 'npwd:deleteNoteSuccess',
  UPDATE_NOTE = 'npwd:updateNote',
  UPDATE_NOTE_SUCCESS = 'npwd:updateNoteSuccess',
  UPDATE_NOTE_FAILURE = 'npwd:updateNoteFailure',
  ACTION_RESULT = 'npwd:notesActionResult',
  SEND_ALERT = 'npwd:notesSetAlert',
}
