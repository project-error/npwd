import { useEffect, useState } from 'react';
import { usePreviousState } from '../../../common/utils/usePreviousState';
import { useSoundProvider } from './useSoundProvider';

interface ISoundOptions {
  volume?: number;
  interrupt?: boolean;
  loop?: boolean;
}

const DEFAULT_OPTIONS = { volume: 1, interrupt: false, loop: false };

/**
 * A hook allowing to play sound
 * @param url The url of the sound you would like to play
 *
 * @param { volume, interrupt, loop} Additional options
 **/
const useSound = (url: string, options: ISoundOptions = DEFAULT_OPTIONS) => {
  const { volume: vol, loop: isLoop, interrupt } = options;

  const [isPlaying, setPlaying] = useState<boolean>(false);

  const {
    mount,
    play,
    stop,
    playing,
    volume,
    loop,
    remove,
    isMounted,
  } = useSoundProvider();

  const previousInterrupt = usePreviousState(interrupt);
  const previousUrl = usePreviousState(url);

  useEffect(() => {
    const changed = previousUrl !== url;
    if (changed) {
      stop(previousUrl);
      remove(previousUrl);
    }
    if (!isMounted(url)) {
      mount(url, vol, isLoop, changed && isPlaying);
      return;
    }
    if (changed && isPlaying) {
      play(url);
    }
    volume(url, vol);
    loop(url, isLoop);
  }, [
    url,
    vol,
    isLoop,
    isMounted,
    volume,
    loop,
    mount,
    previousUrl,
    stop,
    remove,
    isPlaying,
    play,
  ]);

  useEffect(() => {
    if (interrupt) {
      stop(url);
      setPlaying(false);
      return;
    }
    if (!playing(url) && previousInterrupt) {
      play();
      setPlaying(true);
    }
  }, [interrupt, play, playing, previousInterrupt, stop, url]);

  return {
    play: () => {
      play(url);
      setPlaying(true);
    },
    stop: () => {
      stop(url);
      setPlaying(false);
    },
    playing: isPlaying,
  };
};

export default useSound;
