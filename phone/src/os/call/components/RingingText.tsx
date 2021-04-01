import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';

const RingingText = () => {
  const [text, setText] = useState<string>('Ringing');
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    const id = setInterval(() => {
      if (step < 3) {
        setStep(step + 1);
        setText(text + '.');
      } else {
        setText('Ringing');
        setStep(0);
      }
    }, 500);
    return () => clearInterval(id);
  }, [step, text]);

  return <Typography>{text}</Typography>;
};

export default RingingText;
