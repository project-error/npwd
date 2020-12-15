import events from "../utils/events";
import { pool } from "./db";
import { useIdentifier, getSource } from "./functions";
import { Note, NoteId } from "../../phone/src/common/typings/notes";

async function addNote(identifier: string, note: Note): Promise<any> {
  const query =
    "INSERT INTO npwd_notes (identifier, title, content) VALUES (?, ?, ?)";
  await pool.query(query, [identifier, note.title, note.content]);
}

async function fetchAllNotes(identifier: string): Promise<Note[]> {
  const query =
    "SELECT * FROM npwd_notes WHERE identifier = ? ORDER BY id DESC";
  const [result] = await pool.query(query, [identifier]);
  const notes = <Note[]>result;
  return notes;
}

async function deleteNote(noteId: number, identifier: string) {
  const query = "DELETE FROM npwd_notes WHERE id = ? AND identifier = ?";
  await pool.query(query, [noteId, identifier]);
}

async function updateNote(note: Note, identifier: string): Promise<any> {
  const query =
    "UPDATE npwd_notes SET title = ?, content = ? WHERE id = ? AND identifier = ?";
  await pool.query(query, [note.title, note.content, note.id, identifier]);
}

onNet(events.NOTE_ADD_NOTE, async (note: Note) => {
  try {
    const _identifier = await useIdentifier();
    addNote(_identifier, note);
    emitNet(events.NOTE_SEND_NOTE_SUCCESS, getSource());
  } catch (error) {
    console.log("NOTES ERROR: ", error);
  }
});

onNet(events.NOTE_FETCH_ALL_NOTES, async () => {
  try {
    const _source = (global as any).source;
    const _identifier = await useIdentifier();
    const notes = await fetchAllNotes(_identifier);
    emitNet(events.NOTE_SEND_NOTE, _source, notes);
  } catch (error) {
    console.log("NOTE ERROR: ", error);
  }
});

onNet(events.NOTE_DELETE_NOTE, async (noteId: NoteId) => {
  try {
    const _identifier = await useIdentifier();
    const id = noteId.id;
    await deleteNote(id, _identifier);
  } catch (error) {
    console.log("NOTE ERROR:", error);
  }
});

onNet(events.NOTE_UPDATE_NOTE, async (note: Note) => {
  const _source = (global as any).source;
  try {
    const _identifier = await useIdentifier();
    updateNote(note, _identifier);
    emitNet(events.NOTE_UPDATE_NOTE_SUCCESS, _source);
  } catch (error) {
    emitNet(events.NOTE_UPDATE_NOTE_FAILURE, _source);
  }
});
