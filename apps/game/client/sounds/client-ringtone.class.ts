export class Ringtone {
  constructor(private readonly ringtoneName: string) {}

  play(): void {
    PlayPedRingtone(this.ringtoneName, PlayerPedId(), true);
  }

  stop(): void {
    StopPedRingtone(PlayerPedId());
  }

  static isPlaying(): boolean {
    return IsPedRingtonePlaying(PlayerPedId());
  }
}
