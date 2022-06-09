export class Sound {
  private readonly _soundName: string;
  private readonly _soundSetName: string;
  readonly _soundId: number;

  constructor(soundName: string, soundSetName: string) {
    this._soundName = soundName;
    this._soundSetName = soundSetName;

    this._soundId = GetSoundId();
  }

  play() {
    PlaySoundFrontend(this._soundId, this._soundName, this._soundSetName, false);
  }

  stop() {
    StopSound(this._soundId);
  }
}
