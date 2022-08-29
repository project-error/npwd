import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  IconButton,
  Paper,
  Tooltip,
} from '@mui/material';
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
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const { uploadRecording } = useAudioMessageAPI();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);

  const audioRef = useRef(new Audio());

  const duration = audioRef.current.duration;

  useEffect(() => {
    audioRef.current.src = recordedAudio;
  }, [recordedAudio]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.ontimeupdate = () => {
        // we need to trunc becuase dayjs does not like decimals
        setCurrentTime(Math.trunc(audioRef.current.currentTime));
      };
    }
  });

  const play = async () => {
    await audioRef.current.play();
    setPlaying(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlaying(false);
  };

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
      await uploadRecording(blob, onClose);
    } catch (err) {
      setIsSending(false);
      console.error(err);
    }
  };

  if (isSending) {
    return (
      <Paper variant="outlined">
        <Box display="flex" height={50} alignItems="center" justifyContent="center">
          <CircularProgress size={30} />
        </Box>
      </Paper>
    );
  }

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
              {dayjs.duration(currentTime * 1000).format('mm:ss')}
              {duration === Infinity
                ? null
                : ` - ${dayjs.duration(Math.trunc(duration) * 1000).format('mm:ss')}`}
            </p>
          </Box>
        ) : (
          <p>Click to play voice message</p>
        )}
        <Box pt={1} pb={1} pr={1}>
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
        <IconButton color="error" size="small" onClick={isRecording && stopRecording}>
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
