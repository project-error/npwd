import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  playing: boolean;
  play: () => Promise<void>;
  pause: () => void;
}

export const useAudioPlayer = (audioEl: HTMLAudioElement): AudioPlayerProps => {
  const [playing, setPlaying] = useState<boolean>(false);

  const play = async () => {
    setPlaying(true);
    await audioEl.play();
  };

  const pause = () => {
    setPlaying(false);
    audioEl.pause();
  };

  return {
    play,
    pause,
    playing,
  };
};
