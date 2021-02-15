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

  const [playing, setPlaying] = useState<boolean>(false);

  const [sound, setSound] = useState<Howl | null>(null);

  // Mount & Dismount handling
  useEffect(() => {
    isMounted.current = true;
    const sound = new Howl({
      src: url,
      volume,
      loop,
    });
    setSound(sound);

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sound) {
      sound.volume(volume);
    }
    // Shouldnt need to rerun if sound changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  const play = useCallback(() => {
    if (!sound) return;

    if (interrupt) return sound.stop();

    sound.play();

    if (isMounted.current) {
      sound.once('end', () => {
        if (!sound.playing()) {
          setPlaying(false);
        }
      });
    }

    if (isMounted.current) {
      setPlaying(true);
    }
  }, [interrupt, sound]);

  const stop = useCallback(() => {
    if (!sound) return;

    sound.stop();

    if (isMounted.current) {
      setPlaying(false);
    }
  }, [sound]);

  return { play, playing, stop };
};

export default useSound;
