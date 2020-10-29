import events from '../utils/events';
import { ESX, getSource } from './server';
import { pool } from './db';
import { useIdentifier } from './functions';

interface Note {
  title: string;
  content: string;
}

interface NoteId {
  id: number
}

async function addNote(identifier: string, note: Note): Promise<any> {
  const query = "INSERT INTO npwd_notes (identifier, title, content) VALUES (?, ?, ?)"
  await pool.query(query, 
    [
      identifier,
      note.title,
      note.content
    ]
  )
}

async function fetchAllNotes(identifier: string): Promise<Note[]> {
  const query = "SELECT * FROM npwd_notes WHERE identifier = ? ORDER BY id DESC"
  const [ result ] = await pool.query(query, [identifier]);
  const notes = <Note[]>result;
  return notes;
}

async function deleteNote(noteId: number) {
  const query = "DELETE FROM npwd_notes WHERE id = ?";
  await pool.query(query, [noteId])
}

onNet(events.NOTE_ADD_NOTE, async (note: Note) => {
  try {
    console.log(note.content, note.title);
    const _identifier = await useIdentifier()
    console.log(_identifier)
    addNote(_identifier, note)
  } 
  catch(error) {
    console.log("NOTES ERROR: ", error)
  }
})

onNet(events.NOTE_FETCH_ALL_NOTES, async () => {
  try {
    const _source = (global as any).source;
    const _identifier = await useIdentifier()
    const notes = await fetchAllNotes(_identifier);
    emitNet(events.NOTE_SEND_NOTE, _source, notes)
  } catch (error) {
    console.log("NOTE ERROR: ", error)
  }
})

onNet(events.NOTE_DELETE_NOTE, async (noteId: NoteId) => {
  const id = noteId.id
  await deleteNote(id)
})