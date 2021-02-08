import events from '../utils/events';
import { sendNotesEvent } from '../utils/messages';

onNet(events.NOTE_SEND_NOTE, (notes: any) => {
  sendNotesEvent('setNotes', notes);
});

RegisterNuiCallbackType(events.NOTE_ADD_NOTE);
on(`__cfx_nui:${events.NOTE_ADD_NOTE}`, (data: any) => {
  emitNet(events.NOTE_ADD_NOTE, data);
});

onNet(events.NOTE_SEND_NOTE_SUCCESS, () => {
  emitNet(events.NOTE_FETCH_ALL_NOTES);
});

RegisterNuiCallbackType(events.NOTE_DELETE_NOTE);
on(`__cfx_nui:${events.NOTE_DELETE_NOTE}`, (data: any) => {
  emitNet(events.NOTE_DELETE_NOTE, data);
  
  emitNet(events.NOTE_FETCH_ALL_NOTES);
});

RegisterNuiCallbackType(events.NOTE_UPDATE_NOTE);
on(`__cfx_nui:${events.NOTE_UPDATE_NOTE}`, (data: any) => {
  emitNet(events.NOTE_UPDATE_NOTE, data);
});

onNet(events.NOTE_UPDATE_NOTE_SUCCESS, () => {
  emitNet(events.NOTE_FETCH_ALL_NOTES);
});


onNet(events.NOTE_ACTION_RESULT, (type: string) => {
  console.log(type)
  sendNotesEvent('setAlert', type)
})