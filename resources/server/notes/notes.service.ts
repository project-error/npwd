import { Note, NotesEvents, NoteServerResponse } from '../../../typings/notes';
import PlayerService from '../players/player.service';
import NotesDB, { _NotesDB } from './notes.db';
import { notesLogger } from './notes.utils';

class _NotesService {
  private readonly notesDB: _NotesDB;

  constructor() {
    this.notesDB = NotesDB;
  }

  async handleAddNote(src: number, note: Note): Promise<void> {
    notesLogger.debug('Handling add note, note:');
    notesLogger.debug(note);
    const identifer = PlayerService.getIdentifier(src);
    try {
      await this.notesDB.addNote(identifer, note);

      const serverRespObj: NoteServerResponse = {
        action: 'ADD',
        suceeded: true,
        refetch: true,
        alert: {
          message: 'NOTES_ADD_SUCCESS',
          type: 'success',
        },
      };

      emitNet(NotesEvents.SERVER_RESP, src, serverRespObj);
    } catch (e) {
      notesLogger.error(`Error in handleAddNote, ${e.message}`);

      const serverRespObj: NoteServerResponse = {
        action: 'ADD',
        suceeded: false,
        alert: {
          message: 'NOTES_ADD_FAILED',
          type: 'success',
        },
      };

      emitNet(NotesEvents.SERVER_RESP, src, serverRespObj);
    }
  }

  async handleFetchNotes(src: number, limit?: number) {
    const identifier = PlayerService.getIdentifier(src);
    try {
      const notes = await this.notesDB.fetchNotes(identifier, limit);
      const serverRespObj: NoteServerResponse = {
        action: 'SEND',
        suceeded: false,
        data: notes,
        refetch: false,
      };
      emitNet(NotesEvents.SEND_NOTE, src, serverRespObj);
    } catch (e) {
      notesLogger.error(`Error in handleFetchNote, ${e.message}`);
    }
  }

  async handleUpdateNote(src: number, note: Note) {
    const identifier = PlayerService.getIdentifier(src);
    try {
      await this.notesDB.updateNote(note, identifier);
      const serverRespObj: NoteServerResponse = {
        action: 'UPDATE',
        suceeded: true,
        refetch: true,
      };
    } catch (e) {
      notesLogger.error(`Error in handleUpdateNote, ${e.message}`);
    }
  }

  async handleShareNote(src: number) {
    // To implement someday
  }

  async handleDeleteNote(src: number, noteId: number) {
    const identifier = PlayerService.getIdentifier(src);
    try {
      await this.notesDB.deleteNote(noteId, identifier);

      const serverRespObj: NoteServerResponse = {
        action: 'DELETE',
        suceeded: true,
        refetch: true,
        alert: {
          message: 'NOTES_DELETE_SUCCESS',
          type: 'success',
        },
      };

      emitNet(NotesEvents.DELETE_NOTE, src, serverRespObj);
    } catch (e) {
      notesLogger.error(`Error in handleDeleteNote, ${e.message}`);
      const serverRespObj: NoteServerResponse = {
        action: 'DELETE',
        suceeded: false,
        alert: {
          message: 'NOTES_DELETE_FAILED',
          type: 'error',
        },
      };

      emitNet(NotesEvents.DELETE_NOTE, src, serverRespObj);
    }
  }
}

const NotesService = new _NotesService();
export default NotesService;
