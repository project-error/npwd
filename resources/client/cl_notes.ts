import { NotesEvents } from '../../typings/notes';
import { RegisterNuiProxy } from './cl_utils';

RegisterNuiProxy(NotesEvents.ADD_NOTE);
RegisterNuiProxy(NotesEvents.FETCH_ALL_NOTES);
RegisterNuiProxy(NotesEvents.UPDATE_NOTE);
RegisterNuiProxy(NotesEvents.DELETE_NOTE);
