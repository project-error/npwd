import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const RingingText = () => {
  const { t } = useTranslation();
  const [text, setText] = useState<string>(t('CALLS.MESSAGES.RINGING'));
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    const id = setInterval(() => {
      if (step < 3) {
        setStep(step + 1);
        setText(text + '.');
      } else {
        setText(t('CALLS.MESSAGES.RINGING'));
        setStep(0);
      }
    }, 500);
    return () => clearInterval(id);
  }, [step, text, t]);

  return <Typography>{text}</Typography>;
};

export default RingingText;
