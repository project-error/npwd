import events from "../utils/events";

onNet(events.BANK_SEND_TRANSFERS, (transfer: any) => {
  SendNuiMessage(
    JSON.stringify({
      app: "BANK",
      method: "setTransaction",
      data: transfer,
    })
  );
});

onNet(events.BANK_SEND_CREDENTIALS, (credentials: any) => {
  SendNuiMessage(
    JSON.stringify({
      app: "BANK",
      method: "setCredentials",
      data: credentials,
    })
  );
});

RegisterNuiCallbackType(events.BANK_ADD_TRANSFER);
on(`__cfx_nui:${events.BANK_ADD_TRANSFER}`, (data: any) => {
  const transfer = data;
  emitNet(events.BANK_ADD_TRANSFER, transfer);
});

onNet(events.BANK_ADD_TRANSFER_SUCCESS, () => {
  emitNet(events.BANK_FETCH_TRANSACTIONS);
});

onNet(events.BANK_TRANSACTION_ALERT, (bool: boolean) => {
  SendNuiMessage(
    JSON.stringify({
      app: "BANK",
      method: "setAlert",
      data: bool,
    })
  );
});

onNet(events.BANK_TRANSACTION_NOTIFICATION, (transfer: any) => {
  SendNuiMessage(
    JSON.stringify({
      app: "BANK",
      method: "setNotification",
      data: transfer,
    })
  );
});
