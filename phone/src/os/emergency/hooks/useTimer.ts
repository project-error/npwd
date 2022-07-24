import { useEffect, useRef, useState } from 'react';

const getTimeFromSeconds = (secs: number) => {
  const totalSeconds = Math.ceil(secs);
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return {
    seconds,
    minutes,
    hours,
  };
};

const useTimer = () => {
  const intervalRef = useRef<NodeJS.Timer>();
  const [seconds, setSeconds] = useState(0);

  const clearIntervalRef = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  };

  const startTimer = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => setSeconds((prevSeconds) => prevSeconds + 1), 1000);
    }
  };

  const resetTimer = () => {
    clearIntervalRef();
  };

  useEffect(() => {
    startTimer();
    return clearIntervalRef;
  }, []);

  return { ...getTimeFromSeconds(seconds), startTimer, resetTimer };
};

export default useTimer;
