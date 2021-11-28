import { Howl } from 'howler';
import React, { createContext, useCallback, useEffect, useRef } from 'react';

interface IMountResponse {
  howl: Howl;
  url: string;
}

interface ISoundContext {
  mount(url: string, volume?: number, loop?: boolean, autoplay?: boolean): Promise<IMountResponse>;
  play(url?: string, volume?: number, loop?: boolean): void;
  stop(url: string): void;
  remove(url: string): boolean;
  volume(url: string, volume?: number): number;
  loop(url: string, loop?: boolean): boolean;
  playing(url: string): boolean;
  isMounted(url: string): boolean;
}
export const soundContext = createContext<ISoundContext>(null);

export const SoundProvider: React.FC = ({ children }) => {
  const soundRefs = useRef<Map<string, { howl: Howl; volume: number }>>();

  useEffect(() => {
    soundRefs.current = new Map();
  }, []);

  const mount = useCallback(
    (url: string, volume: number = 1, loop: boolean = false, autoplay: boolean = false) => {
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
          res({ howl: instance, url });
        });

        const onError = (_id, e) => {
          res(null);
          console.error('Howler Error \n', e, '\nid: ', _id, '\nsrc: ', url);
        };

        instance.once('loaderror', onError);

        instance.once('playerror', onError);
      });
    },
    [],
  );

  const play = useCallback(
    (url: string, volume: number, loop: boolean) => {
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
    },
    [mount],
  );

  const volume = useCallback((url: string, volume: number = undefined): number => {
    const sound = soundRefs.current.get(url);
    return sound?.howl.volume(volume) as number;
  }, []);

  const loop = useCallback((url: string, loop: boolean = undefined): boolean => {
    const sound = soundRefs.current.get(url);
    sound.howl.loop(loop);
    return sound.howl.loop();
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
      return;
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
