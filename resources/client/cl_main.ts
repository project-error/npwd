import config from '../utils/config';
import events from '../utils/events';
import { sendMessage } from '../utils/messages';
import { phoneCloseAnim, phoneOpenAnim, removePhoneProp } from './functions';

let isPhoneOpen = false;
let isPhoneReady = false;

/* * * * * * * * * * * * *
 *
 *  Phone initialize data
 *
 * * * * * * * * * * * * */
function fetchOnInitialize() {
  isPhoneReady = true;
  emitNet(events.CONTACTS_GET_CONTACTS);
  emitNet(events.MESSAGES_FETCH_MESSAGE_GROUPS);
  emitNet(events.TWITTER_GET_OR_CREATE_PROFILE);
  sendMessage('PHONE', 'setPhoneReady', isPhoneReady);
  sendMessage('PHONE', 'phoneConfig', config);
}

RegisterKeyMapping('phone', 'Open Phone', 'keyboard', 'f1');

/* * * * * * * * * * * * *
 *
 *  Phone Visibility Handling
 *
 * * * * * * * * * * * * */

const showPhone = async (): Promise<void> => {
  isPhoneOpen = true;
  await phoneOpenAnim(); // Animation starts before the phone is open
  emitNet('phone:getCredentials');
  SetCursorLocation(0.9, 0.922); //Experimental
  sendMessage('PHONE', 'setVisibility', true);
  SetNuiFocus(true, true);
};

const hidePhone = async (): Promise<void> => {
  isPhoneOpen = false;
  sendMessage('PHONE', 'setVisibility', false);
  await phoneCloseAnim();
  SetNuiFocus(false, false);
};

/* * * * * * * * * * * * *
 *
 *  Register Command and Keybinding
 *
 * * * * * * * * * * * * */
RegisterCommand(
  'phone',
  async () => {
    //-- Toggles Phone
    await Phone();
  },
  false,
);

RegisterCommand(
  'phone:restart',
  async () => {
    await hidePhone();
    sendMessage('PHONE', 'phoneRestart', {});
  },
  false,
);

/* * * * * * * * * * * * *
 *
 *  Misc. Helper Functions
 *
 * * * * * * * * * * * * */

async function Phone(): Promise<void> {
  fetchOnInitialize();
  if (config.PhoneAsItem) {
    // TODO: Do promise callback here
    // const hasPhoneItem = await emitNetPromise('phone:hasPhoneItem')
    // if (!hasPhoneItem) return
  }
  if (isPhoneOpen) {
    await hidePhone();
  } else {
    await showPhone();
  }
}

// triggerd when the player is ready
onNet(events.PLAYER_IS_READY, fetchOnInitialize);

AddEventHandler('onResourceStop', function (resource: string) {
  if (resource === GetCurrentResourceName()) {
    sendMessage('PHONE', 'setVisibility', false);
    SetNuiFocus(false, false);
    removePhoneProp(); //Deletes the phone incase it was attached.
    ClearPedTasks(PlayerPedId()); //Leave here until launch as it'll fix any stuck animations.
  }
});

onNet('phone:sendCredentials', (number: string) => {
  sendMessage('SIMCARD', 'setNumber', number);
});

// DO NOT CHANGE THIS EITHER, PLEASE - CHIP
// ^ AND WHAT ARE YOU GOING TO DO HUH? - KIDZ

/* * * * * * * * * * * * *
 *
 *  NUI Service Callback Registration
 *
 * * * * * * * * * * * * */
RegisterNuiCallbackType(events.OPEN_APP_LISTINGS);
on(`__cfx_nui:${events.OPEN_APP_LISTINGS}`, (data: any, cb: Function) => {
  emitNet(events.SELLOUT_FETCH_LISTING);
  cb();
});

RegisterNuiCallbackType(events.OPEN_APP_NOTES);
on(`__cfx_nui:${events.OPEN_APP_NOTES}`, (data: any, cb: Function) => {
  emitNet(events.NOTE_FETCH_ALL_NOTES);
  cb();
});

RegisterNuiCallbackType(events.OPEN_APP_BANK);
on(`__cfx_nui:${events.OPEN_APP_BANK}`, (data: any, cb: Function) => {
  emitNet(events.BANK_FETCH_TRANSACTIONS);
  emitNet(events.BANK_GET_CREDENTIALS);
  cb();
});

RegisterNuiCallbackType(events.OPEN_APP_CAMERA);
on(`__cfx_nui:${events.OPEN_APP_CAMERA}`, (data: any, cb: Function) => {
  emitNet(events.CAMERA_FETCH_PHOTOS);
  cb();
});

RegisterNuiCallbackType(events.OPEN_APP_DAILER);
on(`__cfx_nui:${events.OPEN_APP_DAILER}`, (data: any, cb: Function) => {
  emitNet(events.PHONE_CALL_FETCH_CALLS);
  cb();
});

RegisterNuiCallbackType('phone:close');
on(`__cfx_nui:phone:close`, async (data: any, cb: Function) => {
  await hidePhone();
  cb();
}); // Called for when the phone is closed via the UI.

// setTick(async () => {
//   while (config.SwimDestroy) {
//     await Delay(config.RunRate * 1000);
//     if (IsPedSwimming(PlayerPedId())) {
//       let chance = Math.floor(Math.random() * 100 + 1);
//       if (chance <= config.DestoryChance) {
//         countPhone((countPhone: boolean) => {
//           if (countPhone) {
//             ESX.ShowNotification("Your phone is ruined from the water!");
//             destroyedPhone = true;
//           }
//         });
//       }
//       if (destroyedPhone) {
//         await Delay(config.DestroyPhoneReCheck * 60000);
//       }
//     }
//   }
// });
