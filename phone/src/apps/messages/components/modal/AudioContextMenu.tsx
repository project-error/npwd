import React, { useState } from 'react';
import { Box, Button, ButtonGroup, Fade, IconButton, Paper, Tooltip } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CloseIcon from '@mui/icons-material/Close';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useRecorder } from '@os/audio/hooks/useRecorder';
import { useAudioPlayer } from '@os/audio/hooks/useAudioPlayer';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

interface AudioContextMenuProps {
  onClose: () => void;
}

interface RecordingButtonsProps {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

interface InteractButtonsProps {
  playing: boolean;
  setPlaying: (playing: boolean) => void;
}

const AudioContextMenu: React.FC<AudioContextMenuProps> = ({ onClose }) => {
  const { audio, recordingState, startRecording, stopRecording } = useRecorder();
  const { duration, currentTime, playing, setPlaying } = useAudioPlayer(audio);

  const handleStartRecord = async () => {
    await startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const formatDuration = (dur: number) => {
    return dayjs.duration(dur).format('mm:ss');
  };

  return (
    <Paper variant="outlined">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box pl={1}>
          {audio && !recordingState.isRecording ? (
            <InteractButtons playing={playing} setPlaying={setPlaying} />
          ) : (
            <RecordingButtons
              startRecording={handleStartRecord}
              stopRecording={handleStopRecording}
              isRecording={recordingState.isRecording}
            />
          )}
        </Box>
        <audio id="voiceMessageAudio" src={audio} />
        {audio && !recordingState.isRecording && (
          <Box>
            <Box>
              <span>{currentTime && currentTime}</span>
              <span>{duration && duration}</span>
            </Box>
          </Box>
        )}
        <Box pt={1} pb={1}>
          <Button
            disabled={recordingState.isRecording}
            variant="text"
            size="small"
            onClick={onClose}
          >
            <CloseIcon />
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

const RecordingButtons: React.FC<RecordingButtonsProps> = ({
  isRecording,
  startRecording,
  stopRecording,
}) => (
  <Box>
    <ButtonGroup>
      <Tooltip title="Record voice message" placement="right">
        <IconButton disabled={isRecording} color="error" size="small" onClick={startRecording}>
          <RadioButtonCheckedIcon />
        </IconButton>
      </Tooltip>
      {isRecording && (
        <IconButton color="error" size="small" onClick={stopRecording}>
          <StopIcon />
        </IconButton>
      )}
    </ButtonGroup>
  </Box>
);

const InteractButtons: React.FC<InteractButtonsProps> = ({ playing, setPlaying }) => (
  <Box>
    <ButtonGroup>
      <IconButton size="small">
        {playing ? (
          <PauseIcon onClick={() => setPlaying(false)} />
        ) : (
          <PlayArrowIcon onClick={() => setPlaying(true)} />
        )}
      </IconButton>
    </ButtonGroup>
  </Box>
);

export default AudioContextMenu;
