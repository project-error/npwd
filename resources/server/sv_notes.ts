import { pool } from './db';
import { getIdentifier, getSource } from './functions';
import { Note, NoteId, NotesEvents } from '../../typings/notes';
import { mainLogger } from './sv_logger';

const notesLogger = mainLogger.child({ module: 'notes' });

async function addNote(identifier: string, note: Note): Promise<any> {
  const query = 'INSERT INTO npwd_notes (identifier, title, content) VALUES (?, ?, ?)';
  await pool.query(query, [identifier, note.title, note.content]);
}

async function fetchAllNotes(identifier: string): Promise<Note[]> {
  const query = 'SELECT * FROM npwd_notes WHERE identifier = ? ORDER BY id DESC';
  const [result] = await pool.query(query, [identifier]);
  return <Note[]>result;
}

async function deleteNote(noteId: number, identifier: string) {
  const query = 'DELETE FROM npwd_notes WHERE id = ? AND identifier = ?';
  await pool.query(query, [noteId, identifier]);
}

async function updateNote(note: Note, identifier: string): Promise<any> {
  const query = 'UPDATE npwd_notes SET title = ?, content = ? WHERE id = ? AND identifier = ?';
  await pool.query(query, [note.title, note.content, note.id, identifier]);
}

onNet(NotesEvents.ADD_NOTE, async (note: Note) => {
  const pSource = getSource();
  try {
    const _identifier = getIdentifier(pSource);
    await addNote(_identifier, note);
    emitNet(NotesEvents.SEND_NOTE_SUCCESS, pSource);
    emitNet(NotesEvents.ACTION_RESULT, pSource, {
      message: 'NOTES_ADD_SUCCESS',
      type: 'success',
    });
  } catch (e) {
    notesLogger.error(`Failed to add note ${e.message}`, {
      source: pSource,
    });
    emitNet(NotesEvents.ACTION_RESULT, pSource, {
      message: 'NOTES_ADD_FAILED',
      type: 'error',
    });
  }
});

onNet(NotesEvents.FETCH_ALL_NOTES, async () => {
  const pSource = getSource();
  try {
    const _identifier = getIdentifier(pSource);
    const notes = await fetchAllNotes(_identifier);
    emitNet(NotesEvents.SEND_NOTE, pSource, notes);
  } catch (e) {
    notesLogger.error(`Failed to fetch notes ${e.message}`, {
      source: pSource,
    });
  }
});

onNet(NotesEvents.DELETE_NOTE, async (noteId: NoteId) => {
  const pSource = getSource();
  try {
    const _identifier = getIdentifier(pSource);
    await deleteNote(noteId.id, _identifier);

    emitNet(NotesEvents.DELETE_NOTE_SUCCESS, pSource);

    emitNet(NotesEvents.ACTION_RESULT, pSource, {
      message: 'NOTES_DELETE_SUCCESS',
      type: 'success',
    });
  } catch (e) {
    const pSource = (global as any).source;
    notesLogger.error(`Failed to delete note, ${e.message}`);
    emitNet(NotesEvents.ACTION_RESULT, pSource, {
      message: 'NOTES_DELETE_FAILED',
      type: 'error',
    });
  }
});

onNet(NotesEvents.UPDATE_NOTE, async (note: Note) => {
  const pSource = getSource();
  try {
    const _identifier = getIdentifier(pSource);
    await updateNote(note, _identifier);
    emitNet(NotesEvents.UPDATE_NOTE_SUCCESS, pSource);

    emitNet(NotesEvents.ACTION_RESULT, pSource, {
      message: 'NOTES_UPDATE_SUCCESS',
      type: 'success',
    });
  } catch (e) {
    emitNet(NotesEvents.UPDATE_NOTE_FAILURE, pSource);
    notesLogger.error(`Failed to update note, ${e.message}`, {
      source: pSource,
    });
    emitNet(NotesEvents.ACTION_RESULT, pSource, {
      message: 'NOTES_UPDATE_FAILED',
      type: 'error',
    });
  }
});
