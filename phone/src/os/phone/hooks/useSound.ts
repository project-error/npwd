import { useState, useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';

interface ISoundOptions {
  volume?: number;
  interrupt?: boolean;
  loop?: boolean;
}

/**
 * A hook allowing to play sound
 * @param url The url of the sound you would like to play
 *
 * @param { volume, interrupt, loop} Additional options
 **/

const useSound = (
  url: string,
  { volume = 1, interrupt = false, loop = false }: ISoundOptions = {}
) => {
  const isMounted = useRef<boolean>(false);
  const soundRef = useRef<Howl>(null);

  const [playing, setPlaying] = useState<boolean>(false);

  const setSound = useCallback((instance) => {
    soundRef.current = instance;
  }, []);

  // Mount & Dismount handling
  useEffect(() => {
    isMounted.current = true;
    setSound(
      new Howl({
        src: url,
        volume: 1,
        loop,
      })
    );

    return () => {
      isMounted.current = false;
    };
  }, [loop, setSound, url]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  const play = useCallback(() => {
    if (!soundRef) return;

    if (interrupt) return soundRef.current.stop();

    soundRef.current.play();

    if (isMounted.current) {
      soundRef.current.once('end', () => {
        if (!soundRef.current.playing()) {
          setPlaying(false);
        }
      });
    }

    if (isMounted.current) {
      setPlaying(true);
    }
  }, [interrupt]);

  const stop = useCallback(() => {
    if (!soundRef.current) return;

    soundRef.current.stop();

    if (isMounted.current) {
      setPlaying(false);
    }
  }, []);

  return { play, playing, stop };
};

export default useSound;
