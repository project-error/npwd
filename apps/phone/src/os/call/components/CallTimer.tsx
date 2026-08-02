import React from 'react';
import useTimer from '../hooks/useTimer';

const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

export const CallTimer = () => {
  const { seconds, hours, minutes } = useTimer();
  return (
    <div>
      <p className="text-[length:var(--keyos-text-body)] text-keyos-fg">
        {`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}
      </p>
    </div>
  );
};
