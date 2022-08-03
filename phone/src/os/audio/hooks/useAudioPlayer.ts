import React, { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  duration: number;
  currentTime: number;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
}

export const useAudioPlayer = (recordedAudio: string): AudioPlayerProps => {
  const [duration, setDuration] = useState<number>(null);
  const [currentTime, setCurrentTime] = useState<number>(null);
  const [playing, setPlaying] = useState<boolean>(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const setAudio = () => {
      console.log('duration', audioRef.current.duration);
      setDuration(audioRef.current.duration);
      setCurrentTime(audioRef.current.currentTime);
    };

    const updateTime = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    if (recordedAudio) {
      const audio = document.getElementById('voiceMessageAudio') as HTMLAudioElement;
      audioRef.current = audio;

      console.log(audio);
      audio.addEventListener('loadeddata', setAudio);
      audio.addEventListener('timeupdate', updateTime);

      playing ? audio.play() : audio.pause();
    }

    return () => {
      if (recordedAudio) {
        audioRef.current.removeEventListener('loadeddata', setAudio);
        audioRef.current.removeEventListener('timeupdate', setAudio);
      }
    };
  });

  return {
    currentTime,
    duration,
    playing,
    setPlaying,
  };
};
