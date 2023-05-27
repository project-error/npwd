import { KvpItems } from '@typings/settings';
import KvpService from './settings/client-kvp.service';
import { Delay } from '../utils/fivem';

global.phoneProp = 0;
let propCreated = false;

/* * * * * * * * * * * * *
 *
 *  Prop Deletion/Creation handling
 *
 * * * * * * * * * * * * */

// TODO: add a option to make server side for people who use entity lockdown.

export const newPhoneProp = async () => {
  const hasNPWDProps = GetConvarInt('NPWD_PROPS', 0);
  let phoneModel;
  if (hasNPWDProps) {
    phoneModel = 'dolu_npwd_phone';
  } else {
    phoneModel = 'prop_amb_phone';
  }
  removePhoneProp(); //deletes the already existing prop before creating another.
  if (!propCreated) {
    RequestModel(phoneModel);

    while (!HasModelLoaded(phoneModel)) {
      await Delay(1);
    }

    const playerPed = PlayerPedId();
    const [x, y, z] = GetEntityCoords(playerPed, true);
    global.phoneProp = CreateObject(GetHashKey(phoneModel), x, y, z + 0.2, true, true, true);
    const boneIndex = GetPedBoneIndex(playerPed, 28422);
    AttachEntityToEntity(
      global.phoneProp, 
      playerPed, 
      boneIndex, 
      0.0, 
      0.0, 
      0.0, 
      0.0, 
      0.0, 
      0.0, 
      true, 
      true, 
      false, 
      false, 
      2, 
      true
    ); //-- Attaches the phone to the player.
    propCreated = true;

    let txtVariation;

    if (hasNPWDProps) {
      txtVariation = KvpService.getKvpInt(KvpItems.NPWD_FRAME);
    }

    SetObjectTextureVariation(global.phoneProp, txtVariation || 7);
    
  } else if (propCreated) {
    console.log('prop already created');
  }
};

export function removePhoneProp() {
  //-- Triggered in newphoneProp function. Only way to destory the prop correctly.
  if (global.phoneProp != 0) {
    DeleteEntity(global.phoneProp);
    global.phoneProp = 0;
    propCreated = false;
  }
}
