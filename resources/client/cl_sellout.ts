import events from '../utils/events';

RegisterNuiCallbackType(events.SELLOUT_ADD_LISTING);
on(`__cfx_nui:${events.SELLOUT_ADD_LISTING}`, (data: any) => {
  emitNet(events.SELLOUT_ADD_LISTING, data)

  setTimeout(() => {
    emitNet(events.SELLOUT_FETCH_LISTING);
    console.log("Fetched")
  }, 500)
})

onNet(events.SELLOUT_SEND_LISTING, (listing: any) => {
  SendNuiMessage(
    JSON.stringify({
      app: "SELLOUT",
      method: "setListings",
      data: listing
    })
  )
})