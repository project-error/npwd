import { Note, NotesEvents } from '../../../typings/notes';
import { getSource } from '../utils/miscUtils';
import NotesService from './notes.service';
import { notesLogger } from './notes.utils';

onNet(NotesEvents.ADD_NOTE, (note: Note) => {
  const src = getSource();
  NotesService.handleAddNote(src, note).catch((e) =>
    notesLogger.error(`Error occured in add note event (${src}), Error:  ${e.message}`),
  );
});

onNet(NotesEvents.FETCH_ALL_NOTES, async (limit?: number) => {
  const src = getSource();
  NotesService.handleFetchNotes(src, limit).catch((e) =>
    notesLogger.error(`Error occurred in fetch note event (${src}), Error:  ${e.message}`),
  );
});

onNet(NotesEvents.DELETE_NOTE, async (noteId: number) => {
  const src = getSource();
  NotesService.handleDeleteNote(src, noteId).catch((e) =>
    notesLogger.error(`Error occured in delete note event (${src}), Error:  ${e.message}`),
  );
});

onNet(NotesEvents.UPDATE_NOTE, async (note: Note) => {
  const src = getSource();
  NotesService.handleUpdateNote(src, note).catch((e) =>
    notesLogger.error(`Error occured in fetch note event (${src}), Error:  ${e.message}`),
  );
});
