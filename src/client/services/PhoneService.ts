import AnimationService from './AnimationService';
// import NpwdAnimationService from './NPWDAnimService';

interface Exports {
  'pma-voice': {
    setCallChannel: (channel: number) => void;
  };
}
const _exports = global.exports as Exports;
const pmaExports = {
  setCallChannel: (channel: number) => {
    _exports['pma-voice'].setCallChannel(channel);
  },
};

class PhoneService {
  state: 'open' | 'closed' | 'onCall' | 'onCamera';
  animate: typeof AnimationService;

  constructor() {
    this.animate = AnimationService;
    this.initListeners();
  }

  private async initListeners() {
    on('onResourceStop', (resourceName: string) => {
      {
        if (resourceName !== GetCurrentResourceName()) {
          return;
        }
      }

      this.handleResourceStop();
    });
  }

  private async handleResourceStop() {
    await this.animate.closePhone();
    SetNuiFocus(false, false);
  }

  private async openPhone() {
    this.state = 'open';
    global.SendNUIMessage({ type: 'SET_PHONE_OPEN', payload: true });
    SetNuiFocus(true, true);
    // SetNuiFocusKeepInput(true);
    await this.animate.openPhone();
  }

  private async closePhone() {
    this.state = 'closed';
    global.SendNUIMessage({ type: 'SET_PHONE_OPEN', payload: false });
    SetNuiFocus(false, false);
    await this.animate.closePhone();
  }

  async togglePhone() {
    if (this.state === 'open') {
      this.closePhone();
    } else {
      this.openPhone();
    }
  }

  async close() {
    this.closePhone();
  }

  async setChannel(channelId: number) {
    pmaExports.setCallChannel(channelId);

    if (channelId === 0) {
      this.endCall();
      return;
    }

    this.onCall();
  }

  private async onCall() {
    this.state = 'onCall';
    await this.animate.startPhoneCall();
  }

  private async endCall() {
    this.state = 'open';
    await this.animate.endPhoneCall();
  }
}

export default new PhoneService();
