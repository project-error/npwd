import { Note } from '../../../typings/notes';
import { pool } from '../db';
import { FetchDefaultLimits } from '../utils/ServerConstants';

export class _NotesDB {
  async addNote(identifier: string, note: Note): Promise<void> {
    const query = 'INSERT INTO npwd_notes (identifier, title, content) VALUES (?, ?, ?)';
    await pool.query(query, [identifier, note.title, note.content]);
  }

  async fetchNotes(
    identifier: string,
    limit = FetchDefaultLimits.NOTES_FETCH_LIMIT,
  ): Promise<Note[]> {
    const query = 'SELECT * FROM npwd_notes WHERE identifier = ? ORDER BY id DESC LIMIT ?';
    const [result] = await pool.query(query, [identifier, limit]);
    return <Note[]>result;
  }

  async deleteNote(noteId: number, identifier: string): Promise<void> {
    const query = 'DELETE FROM npwd_notes WHERE id = ? AND identifier = ?';
    await pool.query(query, [noteId, identifier]);
  }

  async updateNote(note: Note, identifier: string): Promise<void> {
    const query = 'UPDATE npwd_notes SET title = ?, content = ? WHERE id = ? AND identifier = ?';
    await pool.query(query, [note.title, note.content, note.id, identifier]);
  }
}

const NotesDB = new _NotesDB();

export default NotesDB;
