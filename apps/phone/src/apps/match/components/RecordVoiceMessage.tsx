import Modal from '@ui/components/Modal';
import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, ButtonGroup, IconButton, Tooltip, Typography } from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useRecorder } from '@os/audio/hooks/useRecorder';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useAudioMessageAPI } from '@apps/messages/hooks/useAudioMessageAPI';
import { LoadingButton } from '@mui/lab';

dayjs.extend(duration);

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

interface IProps {
  open: boolean;
  closeModal: () => void;
  setVoiceMessage: (voiceMessage: Blob) => void;
}

const RecordVoiceMessage = ({ open, closeModal, setVoiceMessage }: IProps) => {
  const {
    blob,
    audio: recordedAudio,
    recordingState,
    startRecording,
    stopRecording,
  } = useRecorder();
  const [currentTime, setCurrentTime] = useState<number | null>(null);
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

  const handleSaveRecording = () => {
    if (!blob) return;
    setVoiceMessage(blob);
    closeModal();
  };

  return (
    <Modal visible={open} handleClose={closeModal}>
      <Box display="flex" alignItems="center" justifyContent="flex-start" py={1}>
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
          <Typography>Record Voice Message</Typography>
        ) : recordingState.isRecording ? (
          <Typography>Recording...</Typography>
        ) : recordedAudio && !isNaN(duration) ? (
          <Box>
            <Typography>
              {dayjs.duration(currentTime * 1000).format('mm:ss')}
              {duration === Infinity
                ? null
                : ` - ${dayjs.duration(Math.trunc(duration) * 1000).format('mm:ss')}`}
            </Typography>
          </Box>
        ) : (
          <Typography>Click to play voice message</Typography>
        )}
      </Box>
      {!recordingState.isRecording && recordedAudio && blob && (
        <Button variant="contained" onClick={handleSaveRecording}>
          Save
        </Button>
      )}
    </Modal>
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

export default RecordVoiceMessage;
