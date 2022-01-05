import React, { useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Stop, PlayArrow } from '@mui/icons-material';
import { useExampleStringValue } from '../hooks/state';
import useSound from '@os/sound/hooks/useSound';
import { useApp } from '@os/apps/hooks/useApps';

export const ExampleApp: React.FC = () => {
  const exampleString = useExampleStringValue();
  const [soundName, setSound] = useState('pixel.ogg');
  const { play, playing, stop } = useSound('media/ringtones/' + soundName);
  const example = useApp('EXAMPLE');

  const toggleSound = () => {
    if (soundName === 'pixel.ogg') {
      setSound('marimba.ogg');
      return;
    }
    setSound('pixel.ogg');
  };

  return (
    <Box height="100%" width="100%" p={2}>
      <Typography variant="h4">Welcome to NPWD!</Typography>
      <Button color="primary">{example.id}</Button>
      {/* Here we are using the value in a h3 tag */}
      <h3>{exampleString}</h3>
      <IconButton onClick={() => (playing ? stop() : play())} size="large">
        {playing ? <Stop /> : <PlayArrow />}
      </IconButton>
      <Button onClick={toggleSound}>Change sound on the fly</Button>
    </Box>
  );
};
