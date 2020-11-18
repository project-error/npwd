import events from "../utils/events";

onNet(events.NOTE_SEND_NOTE, (notes: any) => {
  SendNuiMessage(
    JSON.stringify({
      app: "NOTES",
      method: "setNotes",
      data: notes,
    })
  );
});

RegisterNuiCallbackType(events.NOTE_ADD_NOTE);
on(`__cfx_nui:${events.NOTE_ADD_NOTE}`, (data: any) => {
  const note = data;
  emitNet(events.NOTE_ADD_NOTE, note);
});

onNet(events.NOTE_SEND_NOTE_SUCCESS, () => {
  emitNet(events.NOTE_FETCH_ALL_NOTES);
});

RegisterNuiCallbackType(events.NOTE_DELETE_NOTE);
on(`__cfx_nui:${events.NOTE_DELETE_NOTE}`, (data: any) => {
  const noteId = data;
  emitNet(events.NOTE_DELETE_NOTE, noteId);

  emitNet(events.NOTE_FETCH_ALL_NOTES);
});

RegisterNuiCallbackType(events.NOTE_UPDATE_NOTE);
on(`__cfx_nui:${events.NOTE_UPDATE_NOTE}`, (data: any) => {
  const note = data;
  emitNet(events.NOTE_UPDATE_NOTE, note);
});

onNet(events.NOTE_UPDATE_NOTE_SUCCESS, () => {
  emitNet(events.NOTE_FETCH_ALL_NOTES);
});
