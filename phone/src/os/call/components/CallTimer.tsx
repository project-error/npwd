import React, { useEffect, useRef } from 'react';
import { useDuration } from '../hooks/useDuration';

const runTimer = (updatedTime, setDuration) => {
  let newTime = { ...updatedTime.current };
  if (newTime.m >= 60) {
    newTime = { ...newTime, h: newTime.h + 1, m: 0 };
  }
  if (newTime.s >= 60) {
    newTime = { ...newTime, m: newTime.m + 1, s: 0 };
  }
  if (newTime.ms >= 100) {
    newTime = { ...newTime, s: newTime.s + 1, ms: 0 };
  }

  newTime = { ...newTime, ms: newTime.ms + 1 };
  updatedTime.current = newTime;
  setDuration(newTime);
};

function CallTimer({ isAccepted }) {
  const { duration, setDuration } = useDuration();
  const updatedTime = useRef({ ms: 0, s: 0, m: 0, h: 0 });
  const timer = useRef(null);

  useEffect(() => {
    if (isAccepted) {
      runTimer(updatedTime, setDuration);
      timer.current = setInterval(() => {
        runTimer(updatedTime, setDuration);
      }, 10);
    } else {
      clearInterval(timer.current);
      timer.current = null;
    }
    return () => clearInterval(timer.current);
  }, [isAccepted, setDuration]);

  if (!duration || !isAccepted) return null;

  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '2em',
        fontSize: 30,
      }}
    >
      <span>{duration.h >= 10 ? duration.h : '0' + duration.h}</span>
      &nbsp;:&nbsp;
      <span>{duration.m >= 10 ? duration.m : '0' + duration.m}</span>
      &nbsp;:&nbsp;
      <span>{duration.s >= 10 ? duration.s : '0' + duration.s}</span>&nbsp;
    </div>
  );
}

export default CallTimer;
