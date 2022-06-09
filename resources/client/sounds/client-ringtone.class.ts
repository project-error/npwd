export class Ringtone {
  constructor(private readonly ringtoneName: string) {}

  play(): void {
    TriggerServerEvent(
      'ambiant_sounds:playEntity',
      this.ringtoneName,
      10.0,
      1.0,
      NetworkGetNetworkIdFromEntity(PlayerPedId()),
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
