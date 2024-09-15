const delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

type GlobalThis = typeof globalThis;

interface Global extends GlobalThis {
  phoneProp?: number;
}

const _global: Global = global;

_global.phoneProp = 0;
let propCreated = false;

export const removePhoneProp = async (isClosing = false) => {
  if (_global.phoneProp != 0) {
    if (isClosing) {
      await delay(250);
    }

    DeleteEntity(_global.phoneProp);
    _global.phoneProp = 0;
    propCreated = false;
  }
};

export const newPhoneProp = async () => {
  const hasNPWDProps = GetConvarInt('NPWD_PROPS', 0);
  let phoneModel;
  if (hasNPWDProps) {
    phoneModel = 'dolu_npwd_phone';
  } else {
    phoneModel = 'prop_amb_phone';
  }

  removePhoneProp(); //deletes the already existing prop before creating another.

  if (propCreated) {
    return;
  }

  RequestModel(phoneModel);

  while (!HasModelLoaded(phoneModel)) {
    await delay(1);
  }

  delay(350).then(() => {
    const playerPed = PlayerPedId();
    const [x, y, z] = GetEntityCoords(playerPed, true);
    typeof globalThis;
    _global.phoneProp = CreateObject(GetHashKey(phoneModel), x, y, z + 0.2, true, true, true);
    const boneIndex = GetPedBoneIndex(playerPed, 28422);
    AttachEntityToEntity(
      _global.phoneProp,
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
      true,
    ); //-- Attaches the phone to the player.
    propCreated = true;

    let txtVariation;

    SetObjectTextureVariation(_global.phoneProp, txtVariation || 7);
  });
};
