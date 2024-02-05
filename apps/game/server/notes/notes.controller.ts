import { BeforeDBNote, DeleteNoteDTO, NoteItem, NotesEvents } from '@typings/notes';
import NotesService from './notes.service';
import { notesLogger } from './notes.utils';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';

onNetPromise<BeforeDBNote, NoteItem>(NotesEvents.ADD_NOTE, (reqObj, resp) => {
  NotesService.handleAddNote(reqObj, resp).catch((e) => {
    notesLogger.error(`Error occured in add note event (${reqObj.source}), Error:  ${e.message}`);
    resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
  });
});

onNetPromise<void, NoteItem[]>(NotesEvents.FETCH_ALL_NOTES, (reqObj, resp) => {
  NotesService.handleFetchNotes(reqObj, resp).catch((e) => {
    notesLogger.error(
      `Error occurred in fetch note event (${reqObj.source}), Error:  ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
  });
});

onNetPromise<DeleteNoteDTO, DeleteNoteDTO>(NotesEvents.DELETE_NOTE, async (reqObj, resp) => {
  NotesService.handleDeleteNote(reqObj, resp).catch((e) => {
    notesLogger.error(
      `Error occured in delete note event (${reqObj.source}), Error:  ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
  });
});

onNetPromise<NoteItem, void>(NotesEvents.UPDATE_NOTE, async (reqObj, resp) => {
  NotesService.handleUpdateNote(reqObj, resp).catch((e) => {
    notesLogger.error(`Error occured in fetch note event (${reqObj.source}), Error:  ${e.message}`);
    resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
  });
});
