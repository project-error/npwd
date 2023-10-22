const SoundIdsByName: { [k: string]: number } = {};
export class Sound {
  private readonly _soundName: string;
  private readonly _soundSetName: string;
  readonly _soundId: number;

  constructor(soundName: string, soundSetName: string) {
    this._soundName = soundName;
    this._soundSetName = soundSetName;

    if (SoundIdsByName[this._soundName]) {
      ReleaseSoundId(SoundIdsByName[this._soundName]);
      delete SoundIdsByName[this._soundName];
    }

    this._soundId = GetSoundId();
    SoundIdsByName[this._soundName] = this._soundId;
  }

  play() {
    PlaySoundFrontend(this._soundId, this._soundName, this._soundSetName, false);
  }

  stop() {
    StopSound(this._soundId);
    ReleaseSoundId(this._soundId);
    if (SoundIdsByName[this._soundName]) delete SoundIdsByName[this._soundName];
  }
}
