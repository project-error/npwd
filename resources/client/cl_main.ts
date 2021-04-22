import { sendMessage } from '../utils/messages';
import { PhoneEvents } from '../../typings/phone';
import { TwitterEvents } from '../../typings/twitter';
import { ContactEvents } from '../../typings/contact';
import { MarketplaceEvents } from '../../typings/marketplace';
import { phoneCloseAnim, phoneOpenAnim, removePhoneProp } from './functions';
import { MessageEvents } from '../../typings/messages';
import { NotesEvents } from '../../typings/notes';
import { BankEvents } from '../../typings/bank';
import { PhotoEvents } from '../../typings/photo';
import { CallEvents } from '../../typings/call';
import { MatchEvents } from '../../typings/match';
import { config } from './client';

let isPhoneOpen = false;
let isPlayerReady = false;
let isUiReady = false;

/* * * * * * * * * * * * *
 *
 *  Phone initialize data
 *
 * * * * * * * * * * * * */
function fetchOnInitialize() {
  emitNet(ContactEvents.GET_CONTACTS);
  emitNet(MessageEvents.FETCH_MESSAGE_GROUPS);
  emitNet(TwitterEvents.GET_OR_CREATE_PROFILE);
  sendMessage('PHONE', PhoneEvents.SET_PHONE_READY, true);
  sendMessage('PHONE', PhoneEvents.SET_CONFIG, config);
}

RegisterKeyMapping('phone', 'Open Phone', 'keyboard', 'f1');

const getCurrentGameTime = () => {
  let hour: string | number = GetClockHours();

  let minute: string | number = GetClockMinutes();

  // Format time if need be
  if (hour < 10) hour = `0${hour}`;
  if (minute < 10) minute = `0${minute}`;

  return `${hour}:${minute}`;
};

/* * * * * * * * * * * * *
 *
 *  Phone Visibility Handling
 *
 * * * * * * * * * * * * */

const showPhone = async (): Promise<void> => {
  isPhoneOpen = true;
  const time = getCurrentGameTime();
  await phoneOpenAnim(); // Animation starts before the phone is open
  emitNet('phone:getCredentials');
  SetCursorLocation(0.9, 0.922); //Experimental
  sendMessage('PHONE', PhoneEvents.SET_VISIBILITY, true);
  sendMessage('PHONE', PhoneEvents.SET_TIME, time);
  SetNuiFocus(true, true);
  SetNuiFocusKeepInput(true);
  emit('npwd:disableControlActions', true);
};

const hidePhone = async (): Promise<void> => {
  isPhoneOpen = false;
  sendMessage('PHONE', PhoneEvents.SET_VISIBILITY, false);
  await phoneCloseAnim();
  SetNuiFocus(false, false);
  SetNuiFocusKeepInput(false);
  emit('npwd:disableControlActions', false);
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
onNet(PhoneEvents.PLAYER_IS_READY, () => {
  isPlayerReady = true;
  if (isUiReady) {
    fetchOnInitialize();
  }
});

AddEventHandler('onResourceStop', function (resource: string) {
  if (resource === GetCurrentResourceName()) {
    sendMessage('PHONE', PhoneEvents.SET_VISIBILITY, false);
    SetNuiFocus(false, false);
    removePhoneProp(); //Deletes the phone incase it was attached.
    ClearPedTasks(PlayerPedId()); //Leave here until launch as it'll fix any stuck animations.
  }
});

onNet(PhoneEvents.SEND_CREDENTIALS, (number: string) => {
  sendMessage('SIMCARD', PhoneEvents.SET_NUMBER, number);
});

RegisterNuiCallbackType(PhoneEvents.UI_IS_READY);
on(`__cfx_nui:${PhoneEvents.UI_IS_READY}`, (_data: any, cb: Function) => {
  isUiReady = true;
  if (isPlayerReady) {
    fetchOnInitialize();
  }
  cb();
});

// DO NOT CHANGE THIS EITHER, PLEASE - CHIP
// ^ AND WHAT ARE YOU GOING TO DO HUH? - KIDZ

/* * * * * * * * * * * * *
 *
 *  NUI Service Callback Registration
 *
 * * * * * * * * * * * * */
RegisterNuiCallbackType(PhoneEvents.OPEN_APP_LISTINGS);
on(`__cfx_nui:${PhoneEvents.OPEN_APP_LISTINGS}`, (data: any, cb: Function) => {
  emitNet(MarketplaceEvents.FETCH_LISTING);
  cb();
});

RegisterNuiCallbackType(PhoneEvents.OPEN_APP_NOTES);
on(`__cfx_nui:${PhoneEvents.OPEN_APP_NOTES}`, (data: any, cb: Function) => {
  emitNet(NotesEvents.FETCH_ALL_NOTES);
  cb();
});

RegisterNuiCallbackType(PhoneEvents.OPEN_APP_BANK);
on(`__cfx_nui:${PhoneEvents.OPEN_APP_BANK}`, (data: any, cb: Function) => {
  emitNet(BankEvents.FETCH_TRANSACTIONS);
  emitNet(BankEvents.GET_CREDENTIALS);
  cb();
});

RegisterNuiCallbackType(PhoneEvents.OPEN_APP_CAMERA);
on(`__cfx_nui:${PhoneEvents.OPEN_APP_CAMERA}`, (data: any, cb: Function) => {
  emitNet(PhotoEvents.FETCH_PHOTOS);
  cb();
});

RegisterNuiCallbackType(PhoneEvents.OPEN_APP_DAILER);
on(`__cfx_nui:${PhoneEvents.OPEN_APP_DAILER}`, (data: any, cb: Function) => {
  emitNet(CallEvents.FETCH_CALLS);
  cb();
});

RegisterNuiCallbackType(PhoneEvents.CLOSE_PHONE);
on(`__cfx_nui:${PhoneEvents.CLOSE_PHONE}`, async (data: any, cb: Function) => {
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

// Will update the phone's time even while its open
// setInterval(() => {
//   const time = getCurrentGameTime()
//   sendMessage('PHONE', 'setTime', time)
// }, 2000);
