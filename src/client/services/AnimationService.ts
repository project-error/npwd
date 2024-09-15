import { newPhoneProp, removePhoneProp } from '../phoneProp';

let handleIntervalBikeAnimationTextArgs = [7, -1, -1];

RegisterCommand(
  'open-anim',
  async (_: unknown, args: string[]) => {
    handleIntervalBikeAnimationTextArgs = args.map((arg) => parseInt(arg, 10));
  },
  false,
);

const delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

const loadAnimDict = async (dict: any) => {
  //-- Loads the animation dict. Used in the anim functions.
  RequestAnimDict(dict);

  while (!HasAnimDictLoaded(dict)) {
    await delay(100);
  }
};

type AnimationState = 'OPEN' | 'CLOSED' | 'ON_CALL' | 'ON_CAMERA';

class AnimationService {
  state: AnimationState = 'CLOSED';
  isInVehicle = false;
  lastAnimationState: AnimationState;
  animationInterval: ReturnType<typeof setInterval>;

  constructor() {
    this.handleResourceStop();

    this.animationInterval = setInterval(async () => {
      const playerPed = PlayerPedId();

      const isInVehicle = IsPedInAnyVehicle(playerPed, true);
      const vehicleStateChanged = isInVehicle !== this.isInVehicle;

      /** Check if vehicle is bike */
      const vehicle = GetVehiclePedIsIn(playerPed, false);
      const vehicleClass = GetVehicleClass(vehicle);
      const isBike = vehicleClass === 8;

      // TODO: implement bike animation handling - because it's not working well right now.

      if (!vehicleStateChanged) {
        return;
      }

      this.isInVehicle = isInVehicle;
      await this.animatePhone();
    }, 250);
  }

  private async setState(status: 'OPEN' | 'CLOSED' | 'ON_CALL' | 'ON_CAMERA') {
    this.lastAnimationState = this.state;
    this.state = status;
    await this.animatePhone();
  }

  async openPhone() {
    this.setState('OPEN');
  }

  async closePhone() {
    await this.setState('CLOSED');
  }

  async startPhoneCall() {
    this.setState('ON_CALL');
  }

  async endPhoneCall() {
    if (this.state !== 'CLOSED') {
      this.setState('OPEN');
    }
  }

  async startCamera() {
    this.setState('ON_CAMERA');
  }

  async closeCamera() {
    if (this.state !== 'CLOSED') {
      this.setState('OPEN');
    }
  }

  private async newPhoneProp() {
    newPhoneProp();
  }

  private async removePhoneProp(isClosing = false) {
    removePhoneProp(isClosing);
  }

  async animatePhone() {
    console.log('Animating phone:');
    console.log('Previous state', this.lastAnimationState);
    console.log('New state:', this.state);

    if (this.state === this.lastAnimationState || !this.lastAnimationState) {
      return;
    }

    if (this.state === 'OPEN') {
      if (this.lastAnimationState === 'ON_CALL') {
        await this.animateEndCall();
        return;
      }

      await this.animateOpen();
    } else if (this.state === 'CLOSED') {
      await this.animateClosed();
    } else if (this.state === 'ON_CALL') {
      await this.animateOnCall();
    }
  }

  private async animateOpen() {
    await this.newPhoneProp();
    if (this.isInVehicle) {
      await this.handleOpenVehicleAnim();
      return;
    }

    await this.handleOpenNormalAnim();
  }

  private async animateClosed() {
    if (this.isInVehicle) {
      await this.handleCloseVehicleAnim();
      return;
    }

    await this.handleCloseNormalAnim();
  }

  private async animateOnCall() {
    await this.handleOnCallNormal();
  }

  private async animateEndCall() {
    await this.handleCallEndCallNormal();
  }

  private async handleOpenVehicleAnim(): Promise<void> {
    const playerPed = PlayerPedId();
    const dict = 'anim@cellphone@in_car@ps';
    const anim = 'cellphone_text_in';
    await loadAnimDict(dict);

    if (!IsEntityPlayingAnim(playerPed, dict, anim, 3)) {
      SetCurrentPedWeapon(playerPed, 0xa2719263, true);
      TaskPlayAnim(playerPed, dict, anim, 7.0, -1, -1, 50, 0, false, false, false);
    }
  }

  private async handleOpenOnBikeAnim(args: number[]): Promise<void> {
    this.newPhoneProp();
    const [blendInSpeed = 7, blendOutSpeed = -1, duration = -1, flag = 50] = args;

    const playerPed = PlayerPedId();
    const dict = 'anim@cellphone@in_car@ps';
    const anim = 'cellphone_text_in';
    await loadAnimDict(dict);
    ClearPedTasks(playerPed);

    if (!IsEntityPlayingAnim(playerPed, dict, anim, 3)) {
      SetCurrentPedWeapon(playerPed, 0xa2719263, true);
      TaskPlayAnim(
        playerPed,
        dict,
        anim,
        blendInSpeed,
        blendOutSpeed,
        duration,
        flag,
        0.2,
        false,
        false,
        false,
      );
    }
  }

  private async handleIntervalBikeAnimationText() {
    const playerPed = PlayerPedId();
    const dict = 'anim@cellphone@in_car@ps';
    const anim = 'cellphone_text_read_base';
    await loadAnimDict(dict);

    if (!IsEntityPlayingAnim(playerPed, dict, anim, 3)) {
      const [blendInSpeed = 50, blendOutSpeed = 300, duration = 2000] =
        handleIntervalBikeAnimationTextArgs;

      SetCurrentPedWeapon(playerPed, 0xa2719263, true);
      TaskPlayAnim(
        playerPed,
        dict,
        anim,
        blendInSpeed,
        blendOutSpeed,
        duration,
        50,
        0,
        false,
        false,
        false,
      );
    }
  }

  private async handleIntervalBikeAnimationCall() {
    const playerPed = PlayerPedId();
    const dict = 'anim@cellphone@in_car@ps';
    const anim = 'cellphone_call_listen_base';
    await loadAnimDict(dict);

    if (!IsEntityPlayingAnim(playerPed, dict, anim, 3)) {
      SetCurrentPedWeapon(playerPed, 0xa2719263, true);
      TaskPlayAnim(playerPed, dict, anim, 7.0, -1, -1, 50, 0, false, false, false);
    }
  }

  private async handleCloseVehicleAnim(): Promise<void> {
    const playerPed = PlayerPedId();
    const DICT = 'anim@cellphone@in_car@ps';
    const ANIM = 'cellphone_text_out';
    StopAnimTask(playerPed, DICT, 'cellphone_text_in', 1.0); // Do both incase they were on the phone.
    StopAnimTask(playerPed, DICT, 'cellphone_call_to_text', 1.0);
    await delay(100);
    TaskPlayAnim(playerPed, DICT, ANIM, -1, 50, 700, 50, 0, false, false, false);

    await delay(600);
    StopAnimTask(playerPed, DICT, ANIM, 1.0);
    removePhoneProp(true);
  }

  private async handleOpenNormalAnim() {
    const playerPed = PlayerPedId();
    //While not in a vehicle it will use this dict.
    const dict = 'cellphone@';
    const anim = 'cellphone_text_in';
    await loadAnimDict(dict);

    if (!IsEntityPlayingAnim(playerPed, dict, anim, 3)) {
      SetCurrentPedWeapon(playerPed, 0xa2719263, true);
      TaskPlayAnim(playerPed, dict, anim, 8.0, -1, -1, 50, 0, false, false, false);
    }
  }

  private async handleCloseNormalAnim() {
    const playerPed = PlayerPedId();
    const DICT = 'cellphone@';
    const ANIM = 'cellphone_text_out';
    StopAnimTask(playerPed, DICT, 'cellphone_text_in', 1.0);
    await delay(100);
    await loadAnimDict(DICT);
    TaskPlayAnim(playerPed, DICT, ANIM, 7.0, -1, -1, 50, 0, false, false, false);
    await delay(200);
    StopAnimTask(playerPed, DICT, ANIM, 1.0);
    removePhoneProp(true);
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

  private async handleResourceStop(): Promise<void> {
    on('onResourceStop', (resourceName: string) => {
      if (resourceName !== GetCurrentResourceName()) {
        return;
      }

      console.log('Resource stopped');
      clearInterval(this.animationInterval);
      this.endPhoneCall();
      this.closePhone();
      this.removePhoneProp();
    });
  }
}

export default new AnimationService();
