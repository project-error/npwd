import { ESX } from './client';
import events from '../utils/events';

const exp = (global as any).exports;

RegisterCommand('call', (source: number, args: string[], raw: any) => {
  emitNet(events.PHONE_BEGIN_CALL, args[0])
}, false)


setImmediate(() => {
  emit('chat:addSuggestion', '/call', 'Call a player', [
    {
      name: 'Phone Number',
      help: 'The phone number to call'
    }
  ])
})

RegisterNuiCallbackType(events.PHONE_BEGIN_CALL);
on(`__cfx_nui:${events.PHONE_BEGIN_CALL}`, (data: any) => {
  emitNet(events.PHONE_BEGIN_CALL, data.number)
})


onNet(events.PHONE_START_CALL, (target: string, phoneNumber: string, id: any) => {
  console.log(`You are talking to ${target} who as the number ${phoneNumber}`);
  exp["mumble-voip"].SetCallChannel(id+1)
})
