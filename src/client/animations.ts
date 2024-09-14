let propCreated = false;

const delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

const loadAnimDict = async (dict: any) => {
  //-- Loads the animation dict. Used in the anim functions.
  RequestAnimDict(dict);

  while (!HasAnimDictLoaded(dict)) {
    await delay(100);
  }
};

class AnimationService {
  phoneProp: number = 0;
  status: 'OPEN' | 'CLOSED' | 'ON_CALL' | 'ON_CAMERA' = 'CLOSED';
  previousStatus: 'OPEN' | 'CLOSED' | 'ON_CALL' | 'ON_CAMERA';

  constructor() {}

  private async setStatus(status: 'OPEN' | 'CLOSED' | 'ON_CALL' | 'ON_CAMERA') {
    this.previousStatus = this.status;
    this.status = status;
    this.animatePhone();
  }

  async openPhone() {
    this.setStatus('OPEN');
  }

  async closePhone() {
    this.setStatus('CLOSED');
  }

  async onCall() {
    this.setStatus('ON_CALL');
  }

  async onCamera() {
    this.setStatus('ON_CAMERA');
  }

  async endCall() {
    if (this.status !== 'ON_CALL') {
      return;
    }

    this.setStatus(this.previousStatus);
  }

  private async newPhoneProp() {
    const hasNPWDProps = GetConvarInt('NPWD_PROPS', 0);
    let phoneModel;
    if (hasNPWDProps) {
      phoneModel = 'dolu_npwd_phone';
    } else {
      phoneModel = 'prop_amb_phone';
    }

    this.removePhoneProp(); //deletes the already existing prop before creating another.

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
      this.phoneProp = CreateObject(GetHashKey(phoneModel), x, y, z + 0.2, true, true, true);
      const boneIndex = GetPedBoneIndex(playerPed, 28422);
      AttachEntityToEntity(
        this.phoneProp,
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

      SetObjectTextureVariation(this.phoneProp, txtVariation || 7);
    });
  }

  private async removePhoneProp(isClosing = false) {
    if (this.phoneProp != 0) {
      if (isClosing) {
        await delay(250);
      }

      DeleteEntity(this.phoneProp);
      this.phoneProp = 0;
      propCreated = false;
    }
  }

  animatePhone() {
    console.log('animatePhone', this.status, this.previousStatus);
    if (this.status === this.previousStatus || !this.previousStatus) {
      return;
    }

    if (this.status === 'OPEN') {
      if (this.previousStatus === 'ON_CALL') {
        this.animateEndCall();
        return;
      }

      this.animateOpen();
    } else if (this.status === 'CLOSED') {
      this.animateClosed();
    } else if (this.status === 'ON_CALL') {
      this.animateOnCall();
    }
  }

  private async animateOpen() {
    await this.newPhoneProp();
    await handleOpenNormalAnim();
  }

  private async animateClosed() {
    await handleCloseNormalAnim();
    await this.removePhoneProp(true);
  }

  private async animateOnCall() {
    await this.handleOnCallNormal();
  }

  private async animateEndCall() {
    await this.handleCallEndCallNormal();
  }

  private async animateOnCamera() {
    await handleOpenNormalAnim();
  }

  private async handleOnCallNormal(): Promise<void> {
    const playerPed = PlayerPedId();
    const DICT = 'cellphone@';
    const ANIM = 'cellphone_call_listen_base';
    if (!IsEntityPlayingAnim(playerPed, DICT, ANIM, 3)) {
      await loadAnimDict(DICT);
      TaskPlayAnim(playerPed, DICT, ANIM, 3.0, 3.0, -1, 49, 0, false, false, false);
    }
  }

  private async handleCallEndCallNormal(): Promise<void> {
    const playerPed = PlayerPedId();
    const DICT = 'cellphone@';
    const ANIM = 'cellphone_call_to_text';

    if (IsEntityPlayingAnim(playerPed, 'cellphone@', 'cellphone_call_listen_base', 49)) {
      await loadAnimDict(DICT);
      TaskPlayAnim(playerPed, DICT, ANIM, 2.5, 8.0, -1, 50, 0, false, false, false);
    }
  }
}

const handleOpenNormalAnim = async () => {
  const playerPed = PlayerPedId();
  //While not in a vehicle it will use this dict.
  const dict = 'cellphone@';
  const anim = 'cellphone_text_in';
  await loadAnimDict(dict);

  if (!IsEntityPlayingAnim(playerPed, dict, anim, 3)) {
    SetCurrentPedWeapon(playerPed, 0xa2719263, true);
    TaskPlayAnim(playerPed, dict, anim, 8.0, -1, -1, 50, 0, false, false, false);
  }
};

const handleCloseNormalAnim = async () => {
  const playerPed = PlayerPedId();
  const DICT = 'cellphone@';
  const ANIM = 'cellphone_text_out';
  StopAnimTask(playerPed, DICT, 'cellphone_text_in', 1.0);
  await delay(100);
  await loadAnimDict(DICT);
  TaskPlayAnim(playerPed, DICT, ANIM, 7.0, -1, -1, 50, 0, false, false, false);
  await delay(200);
  StopAnimTask(playerPed, DICT, ANIM, 1.0);
};

export default new AnimationService();
