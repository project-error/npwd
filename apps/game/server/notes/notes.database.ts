import { BeforeDBNote, NoteItem } from '@typings/notes';
import { ResultSetHeader } from 'mysql2';
import { DbInterface } from '@npwd/database';

export class _NotesDB {
  async addNote(identifier: string, note: BeforeDBNote): Promise<number> {
    const query = 'INSERT INTO npwd_notes (identifier, title, content) VALUES (?, ?, ?)';
    const [result] = await DbInterface._rawExec(query, [identifier, note.title, note.content]);
    return (<ResultSetHeader>result).insertId;
  }

  async fetchNotes(identifier: string): Promise<NoteItem[]> {
    const query = 'SELECT * FROM npwd_notes WHERE identifier = ? ORDER BY id DESC';
    const [result] = await DbInterface._rawExec(query, [identifier]);
    return <NoteItem[]>result;
  }

  async deleteNote(noteId: number, identifier: string): Promise<void> {
    const query = 'DELETE FROM npwd_notes WHERE id = ? AND identifier = ?';
    await DbInterface._rawExec(query, [noteId, identifier]);
  }

  async updateNote(note: NoteItem, identifier: string): Promise<void> {
    const query = 'UPDATE npwd_notes SET title = ?, content = ? WHERE id = ? AND identifier = ?';
    await DbInterface._rawExec(query, [note.title, note.content, note.id, identifier]);
  }
}

export const NotesDB = new _NotesDB();
