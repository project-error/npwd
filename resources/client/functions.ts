import { Delay } from '../utils/fivem';

let prop = 0;
let isPhoneOpen = false;
let propCreated = false;
let phoneModel = 'prop_amb_phone'; // Refered to in newphoneProp function. Requires custom phone being streamed.

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
  } else if (propCreated) {
    console.log('prop already created');
  }
};

export function removePhoneProp() {
  //-- Triggered in newphoneProp function. Only way to destory the prop correctly.
  if (prop != 0) {
    //Citizen.invokeNative(0xAE3CBE5BF394C9C9 , Citizen.pointerValueIntInitialized(prop))
    DeleteEntity(prop);
    prop = 0;
    propCreated = false;
  }
}

/* * * * * * * * * * * * *
 *
 *  Animations
 *
 * * * * * * * * * * * * */

export async function loadAnimDict(dict: any) {
  //-- Loads the animation dict. Used in the anim functions.
  while (!HasAnimDictLoaded(dict)) {
    RequestAnimDict(dict);
    await Delay(100);
  }
}
 
const handleOpenVehicleAnim = async (playerPed: number): Promise<void> => {
  const dict = 'anim@cellphone@in_car@ps';

  SetCurrentPedWeapon(playerPed, 0xA2719263, true)
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
  
  SetCurrentPedWeapon(playerPed, 0xA2719263, true)
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

const handleCallStartVehicleAnim = async (playerPed: number): Promise<void> => {
  //true refers to at get in.
  const DICT = 'anim@cellphone@in_car@ps';
  const ANIM = 'cellphone_text_to_call';

  StopAnimTask(playerPed, DICT, 'cellphone_text_in', 1.0);
  removePhoneProp(); 
  console.log(ANIM)
  await loadAnimDict(DICT);
  TaskPlayAnim(playerPed, DICT, ANIM, 8.0, -1, -1, 50, 0, false, false, false);
};

const handleCallEndVehicleAnim = async (playerPed: number): Promise<void> => {
  //true refers to at get in.
  const DICT = 'anim@cellphone@in_car@ps';
  const ANIM = 'cellphone_call_to_text';

  StopAnimTask(playerPed, DICT, 'cellphone_text_to_call', 1.0);
  removePhoneProp();
  console.log(ANIM)
  await loadAnimDict(DICT);
  TaskPlayAnim(playerPed, DICT, ANIM, 8.0, -1, -1, 50, 0, false, false, false);
};

const handleCallStartNormalAnim = async (playerPed: number): Promise<void> => {
  const DICT = 'cellphone@';
  const ANIM = 'cellphone_text_to_call';
  console.log(ANIM)
  await loadAnimDict(DICT); 
  TaskPlayAnim(playerPed, DICT, ANIM, 8.0, -1, -1, 50, 0, false, false, false);
};

const handleCallEndNormalAnim = async (playerPed: number): Promise<void> => {
  const DICT = 'cellphone@';
  const ANIM = 'cellphone_call_to_text';

  StopAnimTask(playerPed, DICT, 'cellphone_text_to_call', 1.0);
  console.log(ANIM)
  await loadAnimDict(DICT); 
  TaskPlayAnim(playerPed, DICT, ANIM, 8.0, -1, -1, 50, 0, false, false, false);
};

export async function phoneOpenAnim(): Promise<void> {
  const playerPed = PlayerPedId();
  removePhoneProp(); //Deleting  before creating a new phone where itll be deleted again.
  if (IsPedInAnyVehicle(playerPed, true)) {
    return await handleOpenVehicleAnim(playerPed);
  }
  return await handleOpenNormalAnim(playerPed);
}

export async function phoneCloseAnim() {
  const playerPed = PlayerPedId();
  if (IsPedInAnyVehicle(playerPed, true)) {
    return await handleCloseVehicleAnim(playerPed);
  }
  await handleCloseNormalAnim(playerPed);
}

export async function phoneCallStartAnim(): Promise<void> {
  const playerPed = PlayerPedId();
  console.log("phoneCallStartAnim")
  if (IsPedInAnyVehicle(playerPed, true)) {
    return await handleCallStartVehicleAnim(playerPed);
  }
  return await handleCallStartNormalAnim(playerPed);
}

export async function phoneCallEndAnim(): Promise<void> {
  const playerPed = PlayerPedId();
  console.log("phoneCallEndAnim")
  if (IsPedInAnyVehicle(playerPed, true)) {
    return await handleCallEndVehicleAnim(playerPed);
  }
  return await handleCallEndNormalAnim(playerPed);
}