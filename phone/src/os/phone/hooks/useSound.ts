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
  const [isMounted, setMounted] = useState<boolean>(false);
  const soundRef = useRef<Howl>(null);

  const [playing, setPlaying] = useState<boolean>(false);

  // Mount & Dismount handling
  useEffect(() => {
    soundRef.current?.unload();
    setPlaying(false);
    setMounted(false);

    soundRef.current = new Howl({
      src: url,
      volume: 1,
      loop: false,
    });

    setMounted(true);

    return () => {
      soundRef.current?.unload();
      soundRef.current = undefined;
    };
  }, [url]);

  useEffect(() => {
    if (isMounted) {
      soundRef.current.volume(volume);
    }
  }, [volume, isMounted]);

  useEffect(() => {
    if (isMounted) {
      soundRef.current.loop(loop);
    }
  }, [loop, isMounted]);

  const play = useCallback(() => {
    if (!soundRef.current) return;

    if (isMounted) {
      soundRef.current.play();
      soundRef.current.once('end', () => {
        if (!soundRef.current.playing()) {
          setPlaying(false);
        }
      });
      setPlaying(true);
    }
  }, [isMounted]);

  const stop = useCallback(() => {
    if (!soundRef.current) return;

    if (isMounted) {
      soundRef.current.stop();
      setPlaying(false);
    }
  }, [isMounted]);

  useEffect(() => {
    if (interrupt && isMounted) {
      stop();
    }
  }, [interrupt, isMounted, stop]);

  return { play, playing, stop };
};

export default useSound;
