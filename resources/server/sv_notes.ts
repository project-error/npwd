import events from '../utils/events';
import { pool } from './db';
import { useIdentifier, getSource } from './functions';
import { Note, NoteId } from '../../phone/src/common/typings/notes';

async function addNote(identifier: string, note: Note): Promise<any> {
  const query =
    'INSERT INTO npwd_notes (identifier, title, content) VALUES (?, ?, ?)';
  await pool.query(query, [identifier, note.title, note.content]);
}

async function fetchAllNotes(identifier: string): Promise<Note[]> {
  const query =
    'SELECT * FROM npwd_notes WHERE identifier = ? ORDER BY id DESC';
  const [result] = await pool.query(query, [identifier]);
  return <Note[]>result;
}

async function deleteNote(noteId: number, identifier: string) {
  const query = 'DELETE FROM npwd_notes WHERE id = ? AND identifier = ?';
  await pool.query(query, [noteId, identifier]);
}

async function updateNote(note: Note, identifier: string): Promise<any> {
  const query =
    'UPDATE npwd_notes SET title = ?, content = ? WHERE id = ? AND identifier = ?';
  await pool.query(query, [note.title, note.content, note.id, identifier]);
}

onNet(events.NOTE_ADD_NOTE, async (note: Note) => {
  try {
    const pSource = (global as any).source
    const _identifier = await useIdentifier();
    await addNote(_identifier, note);
    emitNet(events.NOTE_SEND_NOTE_SUCCESS, pSource);
    emitNet(events.NOTE_ACTION_RESULT, pSource, { message: 'NOTES_ADD_SUCCESS', type: 'success' })

  } catch (error) {
    const pSource = (global as any).source
    emitNet(events.NOTE_ACTION_RESULT, pSource, 'NOTES_ADD_FAILED')
  }
});

onNet(events.NOTE_FETCH_ALL_NOTES, async () => {
  try {
    const pSource = (global as any).source
    const _identifier = await useIdentifier();
    const notes = await fetchAllNotes(_identifier);
    emitNet(events.NOTE_SEND_NOTE, pSource, notes);

  } catch (error) {
    console.dir(error)
  }
});

onNet(events.NOTE_DELETE_NOTE, async (noteId: NoteId) => {
  try {
    const pSource = (global as any).source;
    const _identifier = await useIdentifier();
    await deleteNote(noteId.id, _identifier);

    emitNet(events.NOTE_ACTION_RESULT, pSource, 'NOTES_DELETE_SUCCESS')

  } catch (error) {
    const pSource = (global as any).source;
    emitNet(events.NOTE_ACTION_RESULT, pSource, 'NOTES_DELETE_FAILED')
  }
});

onNet(events.NOTE_UPDATE_NOTE, async (note: Note) => {
  try {
    const pSource = (global as any).source;
    const _identifier = await useIdentifier();
    await updateNote(note, _identifier);
    emitNet(events.NOTE_UPDATE_NOTE_SUCCESS, pSource);
    emitNet(events.NOTE_ACTION_RESULT, pSource, 'NOTES_UPDATE_SUCCESS')

  } catch (error) {
    const pSource = (global as any).source;
    emitNet(events.NOTE_UPDATE_NOTE_FAILURE, pSource);
  }
});

