import { Howl } from 'howler';
import React, { createContext, useCallback, useEffect, useRef } from 'react';

interface IMountResponse {
  howl: Howl;
  url: string;
}

interface ISoundContext {
  mount(
    url: string,
    volume?: number,
    loop?: boolean,
    autoplay?: boolean
  ): Promise<IMountResponse>;
  play(url?: string, volume?: number, loop?: boolean): void;
  stop(url: string): void;
  remove(url: string): boolean;
  volume(url: string, volume?: number): number;
  playing(url: string): boolean;
  isMounted(url: string): boolean;
}

export const soundContext = createContext<ISoundContext>(null);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const soundRefs = useRef<Map<string, { howl: Howl; volume: number }>>();

  useEffect(() => {
    soundRefs.current = new Map();
  }, []);

  const mount = (
    url: string,
    volume: number = 1,
    loop: boolean = false,
    autoplay: boolean = false
  ) => {
    return new Promise<IMountResponse>((res) => {
      if (!soundRefs.current) {
        soundRefs.current = new Map();
      }

      const find = soundRefs.current.get(url);

      if (find) {
        find.howl.volume(volume);
        find.howl.loop(loop);
        if (autoplay) {
          find.howl.play();
        }
        return res({ howl: find.howl, url });
      }

      const instance = new Howl({
        src: url,
        loop,
        volume,
        autoplay,
      });

      soundRefs.current.set(url, { howl: instance, volume });

      instance.once('load', () => {
        console.log('ready', instance);
        res({ howl: instance, url });
      });

      const onError = (_id, e) => {
        res(null);
        console.error('Howler Error \n', e, '\nid: ', _id, '\nsrc: ', url);
      };

      instance.once('loaderror', onError);

      instance.once('playerror', onError);
    });
  };

  const play = useCallback((url: string, volume: number, loop: boolean) => {
    const sound = soundRefs.current.get(url);
    let fadedSounds = [];
    if (sound) {
      soundRefs.current.forEach((ref, key) => {
        const isCurrent = key === url;
        const isPlaying = ref.howl.playing();
        const isLoop = ref.howl.loop();
        if (isCurrent || !isLoop || !isPlaying) {
          return;
        }
        fadedSounds.push(ref);
        const currVol = ref.howl.volume();
        ref.howl.fade(currVol, currVol * 0.3, 50);
      });
      if (volume !== undefined) {
        sound.howl.volume(volume);
      }
      if (loop !== undefined) {
        sound.howl.loop(loop);
      }
      sound.howl.play();

      sound.howl.once('end', () => {
        fadedSounds.forEach((s) => {
          s.howl.fade(s.howl.volume(), s.volume, 50);
        });
        fadedSounds = undefined;
      });
      return;
    }
    mount(url, volume, loop, true);
  }, []);

  const volume = (url: string, volume: number = undefined): number => {
    const sound = soundRefs.current.get(url);
    return sound?.howl.volume(volume) as number;
  };

  const stop = (url: string) => {
    const sound = soundRefs.current.get(url);
    sound?.howl.stop();
  };

  const remove = (url: string): boolean => {
    const sound = soundRefs.current.get(url);
    if (sound) {
      sound.howl.stop();
      sound.howl.unload();
      soundRefs.current.delete(url);
      return true;
    }
    return false;
  };

  const isMounted = (url: string): boolean => {
    if (!soundRefs.current) {
      return false;
    }
    return !!soundRefs.current.get(url);
  };

  const playing = (url: string) => {
    const sound = soundRefs.current.get(url);
    return sound?.howl.playing() || false;
  };

  return (
    <soundContext.Provider
      value={{ mount, play, stop, playing, remove, volume, isMounted }}
    >
      {children}
    </soundContext.Provider>
  );
};
