import { Howl } from 'howler';
import React, { createContext, useCallback, useEffect, useRef } from 'react';

interface IMountResponse {
  howl: Howl;
  url: string;
}

type Sound = {
  howl: Howl;
  volume: number;
};

interface ISoundContext {
  mount(
    url: string,
    volume?: number | Howl,
    loop?: boolean,
    autoplay?: boolean,
  ): Promise<IMountResponse | null>;
  play(url?: string, volume?: number, loop?: boolean): void;
  stop(url: string): void;
  remove(url: string): boolean;
  volume(url: string, volume?: number): number | Howl;
  loop(url: string, loop?: boolean): boolean;
  playing(url: string): boolean;
  isMounted(url: string): boolean;
}
export const soundContext = createContext<ISoundContext>({} as ISoundContext);

export const SoundProvider: React.FC = ({ children }) => {
  const soundRefs = useRef<Map<string, { howl: Howl; volume: number }>>();

  useEffect(() => {
    soundRefs.current = new Map();
  }, []);

  const mount = useCallback(
    (url: string, volume: number = 1, loop: boolean = false, autoplay: boolean = false) => {
      return new Promise<IMountResponse | null>((res) => {
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
          res({ howl: instance, url });
        });

        const onError = (event: number, e: unknown) => {
          res(null);
          console.error('Howler Error \n', e, '\nid: ', event, '\nsrc: ', url);
        };

        instance.once('loaderror', onError);

        instance.once('playerror', onError);
      });
    },
    [],
  );

  const play = useCallback(
    (url: string, volume: number, loop: boolean) => {
      const sound = soundRefs?.current?.get(url);
      const fadedSounds: Sound[] = [];
      if (sound) {
        soundRefs?.current?.forEach((ref, key) => {
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
          fadedSounds.forEach((sound) => {
            sound?.howl.fade(sound?.howl?.volume(), sound?.volume, 50);
          });
          fadedSounds.length = 0;
        });
        return;
      }
      mount(url, volume, loop, true);
    },
    [mount],
  );

  const volume = useCallback((url: string, volume = 100): number | Howl => {
    const sound = soundRefs?.current?.get(url);
    return sound?.howl?.volume(volume) ?? 100;
  }, []);

  const loop = useCallback((url: string, loop: boolean = false): boolean => {
    const sound = soundRefs?.current?.get(url);
    sound?.howl.loop(loop);
    return sound?.howl.loop() ?? false;
  }, []);

  const stop = useCallback((url: string) => {
    if (!soundRefs.current) {
      return;
    }
    const sound = soundRefs.current.get(url);
    sound?.howl.stop();
  }, []);

  const remove = useCallback((url: string): boolean => {
    if (!soundRefs.current) {
      return false;
    }

    const sound = soundRefs.current.get(url);
    if (sound) {
      sound.howl.stop();
      sound.howl.unload();
      soundRefs.current.delete(url);
      return true;
    }
    return false;
  }, []);

  const isMounted = useCallback((url: string): boolean => {
    if (!soundRefs.current) {
      return false;
    }
    return !!soundRefs.current.get(url);
  }, []);

  const playing = useCallback((url: string) => {
    if (!soundRefs.current) {
      return false;
    }
    const sound = soundRefs.current.get(url);
    return sound?.howl.playing() || false;
  }, []);

  return (
    <soundContext.Provider value={{ mount, play, stop, playing, remove, volume, loop, isMounted }}>
      {children}
    </soundContext.Provider>
  );
};
