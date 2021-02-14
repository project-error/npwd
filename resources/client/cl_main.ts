import config from '../utils/config';
import { Delay } from '../utils/fivem';
import events from '../utils/events';

let prop = 0;
let isPhoneOpen = false;
let propCreated = false;
let phoneModel = 'prop_amb_phone'; // Refered to in newphoneProp function. Requires custom phone being streamed.

/* * * * * * * * * * * * *
 *
 *  Register Command and Keybinding
 *
 * * * * * * * * * * * * */

RegisterCommand(
  'phone:close',
  async (source: any, args: string[], raw: any) => {
    await phoneCloseAnim();
    SetNuiFocus(false, false);
    SendNuiMessage(
      JSON.stringify({
        app: 'PHONE',
        method: 'setVisibility',
        data: false,
      })
    );
  },
  false
);

RegisterCommand(
  '+phone',
  async () => {
    //-- Toggles Phone
    await Phone();
  },
  false
);

RegisterCommand(
  'phone:open',
  async () => {
    await Phone();
  },
  false
);

RegisterKeyMapping('+phone', 'Open Phone', 'keyboard', 'f1');

/* * * * * * * * * * * * *
 *
 *  Prop Deletion/Creation handling
 *
 * * * * * * * * * * * * */

const newPhoneProp = async () => {
  removePhoneProp(); //deletes the already existing prop before creating another.
  if (!propCreated) {
    RequestModel(phoneModel);

    while (!HasModelLoaded(phoneModel)) {
      await Delay(1);
    }

    const playerPed = PlayerPedId();
    const [x, y, z] = GetEntityCoords(playerPed, true);
    prop = CreateObject(
      GetHashKey(phoneModel),
      x,
      y,
      z + 0.2,
      true,
      true,
      true
    );
    //prop = CreateObject(GetHashKey(phoneModel), 1.0, 1.0, 1.0, 1, 1, 0)
    const boneIndex = GetPedBoneIndex(playerPed, 28422);
    AttachEntityToEntity(
      prop,
      playerPed,
      boneIndex,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      -0.0,
      true,
      true,
      false,
      true,
      1.0,
      true
    ); //-- Attaches the phone to the player.
    propCreated = true;
    console.log('prop created');
  } else if (propCreated) {
    console.log('prop already created');
  }
};

function removePhoneProp() {
  //-- Triggered in newphoneProp function. Only way to destory the prop correctly.
  if (prop != 0) {
    //Citizen.invokeNative(0xAE3CBE5BF394C9C9 , Citizen.pointerValueIntInitialized(prop))
    DeleteEntity(prop);
    prop = 0;
    propCreated = false;
  }
}

async function loadAnimDict(dict: any) {
  //-- Loads the animation dict. Used in the anim functions.
  while (!HasAnimDictLoaded(dict)) {
    RequestAnimDict(dict);
    await Delay(100);
  }
}

/* * * * * * * * * * * * *
 *
 *  Animations
 *
 * * * * * * * * * * * * */

const handleOpenVehicleAnim = async (playerPed: number): Promise<void> => {
  const dict = 'anim@cellphone@in_car@ps';

  ClearPedTasks(playerPed);
  await loadAnimDict(dict);
  TaskPlayAnim(
    playerPed,
    dict,
    'cellphone_text_in',
    8.0,
    -1,
    -1,
    50,
    0,
    false,
    false,
    false
  );
  await Delay(300); //Gives time for animation starts before creating the phone
  await newPhoneProp(); //Creates the phone and attaches it.
};

const handleOpenNormalAnim = async (playerPed: number): Promise<void> => {
  //While not in a vehicle it will use this dict.
  const dict = 'cellphone@';

  ClearPedTasks(playerPed);
  await loadAnimDict(dict);
  TaskPlayAnim(
    playerPed,
    dict,
    'cellphone_text_in',
    8.0,
    -1,
    -1,
    50,
    0,
    false,
    false,
    false
  );
  await Delay(300); //Gives time for animation starts before creating the phone
  await newPhoneProp(); //Creates the phone and attaches it.
};

const handleCloseVehicleAnim = async (playerPed: number): Promise<void> => {
  //true refers to at get in.
  const DICT = 'anim@cellphone@in_car@ps';
  const ANIM = 'cellphone_text_out';

  StopAnimTask(playerPed, DICT, 'cellphone_text_in', 1.0); //Stop the pull out animation
  removePhoneProp(); //Deletes the prop early incase they get out of the vehicle.
  await Delay(250); //lets it get to a certain point
  await loadAnimDict(DICT); //loads the new animation
  TaskPlayAnim(playerPed, DICT, ANIM, 8.0, -1, -1, 50, 0, false, false, false); //puts phone into pocket
  await Delay(200); //waits until the phone is in the pocket
  StopAnimTask(playerPed, DICT, ANIM, 1.0); //clears the animation
};

const handleCloseNormalAnim = async (playerPed: number): Promise<void> => {
  const DICT = 'cellphone@';
  const ANIM = 'cellphone_text_out';
  StopAnimTask(playerPed, DICT, 'cellphone_text_in', 1.0); //Stop the pull out animation
  await Delay(100); //lets it get to a certain point
  await loadAnimDict(DICT); //loads the new animation
  TaskPlayAnim(playerPed, DICT, ANIM, 8.0, -1, -1, 50, 0, false, false, false); //puts phone into pocket
  await Delay(200); //waits until the phone is in the pocket
  StopAnimTask(playerPed, DICT, ANIM, 1.0); //clears the animation
  removePhoneProp(); //Deletes the prop.
};

async function phoneOpenAnim(): Promise<void> {
  const playerPed = PlayerPedId();
  removePhoneProp(); //Deleting  before creating a new phone where itll be deleted again.
  if (IsPedInAnyVehicle(playerPed, true)) {
    return await handleOpenVehicleAnim(playerPed);
  }
  return await handleOpenNormalAnim(playerPed);
}

async function phoneCloseAnim() {
  const playerPed = PlayerPedId();
  if (IsPedInAnyVehicle(playerPed, true)) {
    return await handleCloseVehicleAnim(playerPed);
  }
  await handleCloseNormalAnim(playerPed);
}

// setTick(() => {
//   if (IsControlJustPressed(1, config.KeyTogglePhone)) {
//     Phone();
//   }
// });

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
  SendNuiMessage(
    JSON.stringify({
      app: 'PHONE',
      method: 'setVisibility',
      data: true,
    })
  );
  sendPhoneConfig();
  SetNuiFocus(true, true);
};

const hidePhone = async (): Promise<void> => {
  isPhoneOpen = false;
  SendNuiMessage(
    //Hides phone
    JSON.stringify({
      app: 'PHONE',
      method: 'setVisibility',
      data: false,
    })
  );
  await phoneCloseAnim();
  SetNuiFocus(false, false);
};

const togglePhoneVisible = async (): Promise<void> => {
  if (isPhoneOpen) {
    await hidePhone();
  } else {
    await showPhone();
  }
};

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
    return await togglePhoneVisible();
  }
  await togglePhoneVisible();
}

function sendPhoneConfig() {
  SendNuiMessage(
    JSON.stringify({
      app: 'PHONE',
      method: 'phoneConfig',
      data: config,
    })
  );
}

AddEventHandler('onResourceStop', function (resource: string) {
  if (resource === GetCurrentResourceName()) {
    SendNuiMessage(
      JSON.stringify({
        app: 'PHONE',
        method: 'setVisibility',
        data: false,
      })
    );
    SetNuiFocus(false, false);
    removePhoneProp(); //Deletes the phone incase it was attached.
    ClearPedTasks(PlayerPedId()); //Leave here until launch as it'll fix any stuck animations.
  }
});

onNet('phone:sendCredentials', (number: string) => {
  SendNuiMessage(
    JSON.stringify({
      app: 'SIMCARD',
      method: 'setNumber',
      data: number,
    })
  );
});



// DO NOT CHANGE THIS EITHER, PLEASE - CHIP

/* * * * * * * * * * * * *
 *
 *  NUI Service Callback Registration
 *
 * * * * * * * * * * * * */

// contacts app
RegisterNuiCallbackType(events.OPEN_APP_CONTACTS);
on(`__cfx_nui:${events.OPEN_APP_CONTACTS}`, (data: any, cb: Function) => {
  emitNet(events.CONTACTS_GET_CONTACTS);
  cb();
});

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
  emitNet(events.CONTACTS_GET_CONTACTS);
  emitNet(events.PHONE_CALL_FETCH_CALLS);
  cb();
});

RegisterNuiCallbackType('phone:close');
on(`__cfx_nui:phone:close`, async (data: any, cb: Function) => {
  await Phone();
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
