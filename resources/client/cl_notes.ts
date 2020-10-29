import events from '../utils/events';

onNet(events.NOTE_SEND_NOTE, (notes: any) => {
  console.log(notes)
  SendNuiMessage(
    JSON.stringify({
      app: "NOTES",
      method: "setNotes",
      data: notes
    })
  )
})

RegisterNuiCallbackType(events.NOTE_ADD_NOTE);
on(`__cfx_nui:${events.NOTE_ADD_NOTE}`, (data: any) => {
  const note = data;
  emitNet(events.NOTE_ADD_NOTE, note)

  setTimeout(() => {
    emitNet(events.NOTE_FETCH_ALL_NOTES)
  }, 500);
})

RegisterNuiCallbackType(events.NOTE_DELETE_NOTE);
on(`__cfx_nui:${events.NOTE_DELETE_NOTE}`, (data: any) => {
  const noteId = data;
  emitNet(events.NOTE_DELETE_NOTE, noteId)

  setTimeout(() => {
    emitNet(events.NOTE_FETCH_ALL_NOTES)
  }, 500);
})