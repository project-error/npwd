import { KvpItems } from '@typings/settings';
import KvpService from './settings/client-kvp.service';
import { Delay } from '../utils/fivem';

let prop = 0;
let propCreated = false;

const plyEntMap: Map<number, number> = new Map();

/* * * * * * * * * * * * *
 *
 *  Prop Deletion/Creation handling
 *
 * * * * * * * * * * * * */

// TODO: add a option to make server side for people who use entity lockdown.

AddStateBagChangeHandler(
  'phonePropData',
  null as any,
  async (
    bagName: string,
    key: string,
    value: any | null,
    _reserved: number,
    replicated: boolean,
  ) => {
    const player = GetPlayerFromStateBagName(bagName);
    if (player === 0) {
      return;
    }

    // Only execute handler once for local client
    if (replicated) return;

    const serverId = GetPlayerServerId(player);
    // Scope here so we don't get an error trying to use ent
    {
      // Check if we already have an entity for this person, if we do then delete it.
      const ent = plyEntMap.get(serverId);
      if (ent) {
        DeleteEntity(ent);
        plyEntMap.delete(serverId);
      }
    }

    // We don't have any PropData so we don't want to do anything else
    if (!value) return;

    const hasNPWDProps = GetConvarInt('NPWD_PROPS', 0);
    let phoneModel;
    if (hasNPWDProps) {
      phoneModel = KvpService.getKvpString(KvpItems.NPWD_FRAME) || 'prop_npwd_default';
    } else {
      phoneModel = 'prop_amb_phone';
    }

    RequestModel(phoneModel);
    while (!HasModelLoaded(phoneModel)) {
      await Delay(1);
    }

    const playerPed = GetPlayerPed(player);
    const [x, y, z] = GetEntityCoords(playerPed, true);

    const prop = CreateObject(GetHashKey(phoneModel), x, y, z, false, false, false);
    plyEntMap.set(serverId, prop);
    AttachEntityToEntity(
      prop,
      playerPed,
      GetPedBoneIndex(playerPed, 28422),
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
    );
  },
);

onNet('onPlayerDropped', async (serverId: number) => {
  if (plyEntMap.has(serverId)) {
    DeleteEntity(plyEntMap.get(serverId));
    plyEntMap.delete(serverId);
  }
});

export const newPhoneProp = async () => {
  LocalPlayer.state.set('phonePropData', true, true);
};

export function removePhoneProp() {
  LocalPlayer.state.set('phonePropData', null, true);
}
