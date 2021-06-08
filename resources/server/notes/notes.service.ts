import { Note, NotesEvents } from '../../../typings/notes';
import PlayerService from '../players/player.service';
import NotesDB, { _NotesDB } from './notes.db';
import { notesLogger } from './notes.utils';

class _NotesService {
  private readonly notesDB: _NotesDB;

  constructor() {
    this.notesDB = NotesDB;
    notesLogger.debug('Notes service started');
  }

  async handleAddNote(src: number, note: Note): Promise<void> {
    notesLogger.debug('Handling add note, note:');
    notesLogger.debug(note);

    const identifer = PlayerService.getIdentifier(src);

    try {
      await this.notesDB.addNote(identifer, note);

      emitNet(NotesEvents.SEND_NOTE_SUCCESS, src);
      emitNet(NotesEvents.ACTION_RESULT, src, {
        message: 'NOTES_ADD_SUCCESS',
        type: 'success',
      });
    } catch (e) {
      notesLogger.error(`Error in handleAddNote, ${e.message}`);

      emitNet(NotesEvents.ACTION_RESULT, src, {
        message: 'NOTES_ADD_FAILED',
        type: 'error',
      });
    }
  }

  async handleFetchNotes(src: number, limit?: number) {
    const identifier = PlayerService.getIdentifier(src);
    try {
      const notes = await this.notesDB.fetchNotes(identifier, limit);
      emitNet(NotesEvents.SEND_NOTE, src, notes);
    } catch (e) {
      notesLogger.error(`Error in handleFetchNote, ${e.message}`);
    }
  }

  async handleUpdateNote(src: number, note: Note) {
    const identifier = PlayerService.getIdentifier(src);
    try {
      await this.notesDB.updateNote(note, identifier);
      emitNet(NotesEvents.UPDATE_NOTE_SUCCESS, src);

      emitNet(NotesEvents.ACTION_RESULT, src, {
        message: 'NOTES_UPDATE_SUCCESS',
        type: 'success',
      });
    } catch (e) {
      emitNet(NotesEvents.UPDATE_NOTE_FAILURE, src);
      emitNet(NotesEvents.ACTION_RESULT, src, {
        message: 'NOTES_UPDATE_FAILED',
        type: 'error',
      });
      notesLogger.error(`Error in handleUpdateNote, ${e.message}`);
    }
  }

  // async handleShareNote(src: number) {
  //   // To implement someday
  // }

  async handleDeleteNote(src: number, noteId: number) {
    const identifier = PlayerService.getIdentifier(src);
    try {
      await this.notesDB.deleteNote(noteId, identifier);

      emitNet(NotesEvents.DELETE_NOTE_SUCCESS, src);

      emitNet(NotesEvents.ACTION_RESULT, src, {
        message: 'NOTES_DELETE_SUCCESS',
        type: 'success',
      });
    } catch (e) {
      notesLogger.error(`Error in handleDeleteNote, ${e.message}`);
      emitNet(NotesEvents.ACTION_RESULT, src, {
        message: 'NOTES_DELETE_FAILED',
        type: 'error',
      });
    }
  }
}

const NotesService = new _NotesService();
export default NotesService;
