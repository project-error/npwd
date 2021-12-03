import { BeforeDBNote, DeleteNoteDTO, NoteItem } from '../../../typings/notes';
import PlayerService from '../players/player.service';
import NotesDB, { _NotesDB } from './notes.db';
import { notesLogger } from './notes.utils';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';

class _NotesService {
  private readonly notesDB: _NotesDB;

  constructor() {
    this.notesDB = NotesDB;
    notesLogger.debug('Notes service started');
  }

  async handleAddNote(
    reqObj: PromiseRequest<BeforeDBNote>,
    resp: PromiseEventResp<NoteItem>,
  ): Promise<void> {
    notesLogger.debug('Handling add note, note:');
    notesLogger.debug(reqObj.data);

    const identifer = PlayerService.getIdentifier(reqObj.source);

    try {
      const noteId = await this.notesDB.addNote(identifer, reqObj.data);
      resp({
        status: 'ok',
        data: { id: noteId, content: reqObj.data.content, title: reqObj.data.title },
      });
    } catch (e) {
      notesLogger.error(`Error in handleAddNote, ${e.message}`);

      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }

  async handleFetchNotes(reqObj: PromiseRequest<void>, resp: PromiseEventResp<NoteItem[]>) {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    try {
      const notes = await this.notesDB.fetchNotes(identifier);
      resp({ status: 'ok', data: notes });
    } catch (e) {
      notesLogger.error(`Error in handleFetchNote, ${e.message}`);
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }

  async handleUpdateNote(reqObj: PromiseRequest<NoteItem>, resp: PromiseEventResp<void>) {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    try {
      await this.notesDB.updateNote(reqObj.data, identifier);
      resp({ status: 'ok' });
    } catch (e) {
      notesLogger.error(`Error in handleUpdateNote, ${e.message}`);
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }

  // async handleShareNote(src: number) {
  //   // To implement someday
  // }

  async handleDeleteNote(
    reqObj: PromiseRequest<DeleteNoteDTO>,
    resp: PromiseEventResp<DeleteNoteDTO>,
  ) {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    try {
      await this.notesDB.deleteNote(reqObj.data.id, identifier);
      resp({ status: 'ok', data: reqObj.data });
    } catch (e) {
      notesLogger.error(`Error in handleDeleteNote, ${e.message}`);
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }
}

const NotesService = new _NotesService();
export default NotesService;
