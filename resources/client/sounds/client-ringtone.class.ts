export class Ringtone {
  constructor(
    private ringtoneName: string,
    private volume: number,
    private readonly vibror: number,
    private readonly looped: boolean,
  ) {}

  play(): void {
    let distance = 10.0;
    if (this.vibror) {
      this.ringtoneName = 'phone/vibror.mp3';
      this.volume = 20;
      distance = 25.0;
    }
    TriggerServerEvent(
      'ambiant_sounds:playEntity',
      this.ringtoneName,
      distance,
      this.volume / 100,
      NetworkGetNetworkIdFromEntity(PlayerPedId()),
      this.looped,
    );
  }

  stop(): void {
    TriggerServerEvent('ambiant_sounds:stopEntity', NetworkGetNetworkIdFromEntity(PlayerPedId()));
  }

  static isPlaying(): boolean {
    let sound = exports['high_3dsounds'].getSound(NetworkGetNetworkIdFromEntity(PlayerPedId()));
    return sound ? true : false;
  }
}
