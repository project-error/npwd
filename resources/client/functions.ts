import { Delay } from '../utils/fivem';

let prop = 0;
let propCreated = false;
const phoneModel = 'prop_amb_phone';

/* * * * * * * * * * * * *
 *
 *  Prop Deletion/Creation handling
 *
 * * * * * * * * * * * * */

// TODO: add a option to make server side for people who use entity lockdown.

export const newPhoneProp = async () => {
  removePhoneProp(); //deletes the already existing prop before creating another.
  if (!propCreated) {
    RequestModel(phoneModel);

    while (!HasModelLoaded(phoneModel)) {
      await Delay(1);
    }

    const playerPed = PlayerPedId();
    const [x, y, z] = GetEntityCoords(playerPed, true);
    prop = CreateObject(GetHashKey(phoneModel), x, y, z + 0.2, true, true, true);
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
      true,
    ); //-- Attaches the phone to the player.
    propCreated = true;
  } else if (propCreated) {
    console.log('prop already created');
  }
};

export function removePhoneProp() {
  //-- Triggered in newphoneProp function. Only way to destory the prop correctly.
  if (prop != 0) {
    DeleteEntity(prop);
    prop = 0;
    propCreated = false;
  }
}