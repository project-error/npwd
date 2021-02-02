import React, { useState, useCallback, useEffect } from 'react';
import { useDuration } from '../hooks/useDuration';

function CallTimer({ isAccepted }) {
  const { duration, setDuration } = useDuration();

  useEffect(() => {
    let timer;
    if (isAccepted) {
      run();
      timer = setInterval(run, 10);
    } else {
      clearInterval(timer);
    }
  }, []);

  let updatedMs = duration.ms,
    updatedS = duration.s,
    updatedM = duration.m,
    updatedH = duration.h;

  if (!duration) return null;

  const run = () => {
    if (updatedM === 60) {
      updatedH++;
      updatedM = 0;
    }
    if (updatedS === 60) {
      updatedM++;
      updatedS = 0;
    }
    if (updatedMs === 100) {
      updatedS++;
      updatedMs = 0;
    }
    updatedMs++;
    return setDuration({
      ms: updatedMs,
      s: updatedS,
      m: updatedM,
      h: updatedH,
    });
  };

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
