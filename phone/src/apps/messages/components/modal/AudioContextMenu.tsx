import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, ButtonGroup, IconButton, Paper, Tooltip } from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CloseIcon from '@mui/icons-material/Close';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useRecorder } from '@os/audio/hooks/useRecorder';
import { useAudioPlayer } from '@os/audio/hooks/useAudioPlayer';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import SendIcon from '@mui/icons-material/Send';
import { useAudioMessageAPI } from '@apps/messages/hooks/useAudioMessageAPI';

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
  play: () => Promise<void>;
  pause: () => void;
}

const AudioContextMenu: React.FC<AudioContextMenuProps> = ({ onClose }) => {
  const {
    blob,
    audio: recordedAudio,
    recordingState,
    startRecording,
    stopRecording,
  } = useRecorder();
  const { currentTime, duration, playing, play, pause } = useAudioPlayer(recordedAudio);
  const { uploadRecording } = useAudioMessageAPI();
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleStartRecord = async () => {
    await startRecording();
  };

  const handleStopRecording = () => {
    // Maybe try to get the duration here, maybe even create a timeout
    // Do want to create a audioRef from useRecorder, or do it all here?
    stopRecording();
  };

  const handleSendRecording = async () => {
    try {
      if (!blob) return;
      setIsSending(true);
      await uploadRecording(blob);
      onClose();
    } catch (err) {
      setIsSending(false);
      console.error(err);
    }
  };

  return (
    <Paper variant="outlined">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box pl={1}>
          {recordedAudio && !recordingState.isRecording ? (
            <InteractButtons play={play} pause={pause} playing={playing} />
          ) : (
            <RecordingButtons
              startRecording={handleStartRecord}
              stopRecording={handleStopRecording}
              isRecording={recordingState.isRecording}
            />
          )}
        </Box>
        {!recordedAudio ? (
          <p>Record voice message</p>
        ) : recordingState.isRecording ? (
          <p>Recording...</p>
        ) : recordedAudio && !isNaN(duration) ? (
          <Box>
            <p>
              {dayjs.duration(currentTime * 1000).format('mm:ss')} -{' '}
              {duration === Infinity ? (
                <p>Loading duration...</p>
              ) : (
                dayjs.duration(Math.trunc(duration) * 1000).format('mm:ss')
              )}
            </p>
          </Box>
        ) : (
          <p>Click to play voice message</p>
        )}
        <Box pt={1} pb={1}>
          {!recordingState.isRecording && recordedAudio && blob && (
            <IconButton onClick={handleSendRecording} size="small">
              <SendIcon color="primary" />
            </IconButton>
          )}
          <IconButton disabled={recordingState.isRecording} size="small" onClick={onClose}>
            <CloseIcon color="error" />
          </IconButton>
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

const InteractButtons: React.FC<InteractButtonsProps> = ({ playing, play, pause }) => (
  <Box>
    <ButtonGroup>
      <IconButton size="small">
        {playing ? <PauseIcon onClick={pause} /> : <PlayArrowIcon onClick={play} />}
      </IconButton>
    </ButtonGroup>
  </Box>
);

export default AudioContextMenu;
