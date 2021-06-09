import { BeforeDBNote, NoteItem } from '../../../typings/notes';
import { pool } from '../db';
import { FetchDefaultLimits } from '../utils/ServerConstants';
import { ResultSetHeader } from 'mysql2';

export class _NotesDB {
  async addNote(identifier: string, note: BeforeDBNote): Promise<number> {
    const query = 'INSERT INTO npwd_notes (identifier, title, content) VALUES (?, ?, ?)';
    const [result] = await pool.query(query, [identifier, note.title, note.content]);
    return (<ResultSetHeader>result).insertId;
  }

  async fetchNotes(identifier: string): Promise<NoteItem[]> {
    const query = 'SELECT * FROM npwd_notes WHERE identifier = ? ORDER BY id DESC';
    const [result] = await pool.query(query, [identifier]);
    return <NoteItem[]>result;
  }

  async deleteNote(noteId: number, identifier: string): Promise<void> {
    const query = 'DELETE FROM npwd_notes WHERE id = ? AND identifier = ?';
    await pool.query(query, [noteId, identifier]);
  }

  async updateNote(note: NoteItem, identifier: string): Promise<void> {
    const query = 'UPDATE npwd_notes SET title = ?, content = ? WHERE id = ? AND identifier = ?';
    await pool.query(query, [note.title, note.content, note.id, identifier]);
  }
}

const NotesDB = new _NotesDB();

export default NotesDB;
