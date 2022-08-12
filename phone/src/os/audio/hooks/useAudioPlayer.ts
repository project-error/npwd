import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  duration: number;
  playing: boolean;
  play: () => Promise<void>;
  pause: () => void;
}

export const useAudioPlayer = (audioSrc: string): AudioPlayerProps => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const isReady = useRef(false);

  useEffect(() => {
    if (audioSrc) {
      console.log('we have audio src');
      audioRef.current = new Audio(audioSrc);
    }
  }, [audioSrc]);

  const play = async () => {
    setPlaying(true);
  };

  const pause = () => {
    setPlaying(false);
  };

  return {
    play,
    pause,
    playing,
    duration,
  };
};
