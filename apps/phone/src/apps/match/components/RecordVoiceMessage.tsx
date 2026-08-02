import Modal from '@ui/components/Modal';
import React, { useEffect, useRef, useState } from 'react';
import { Circle, Square, Play, Pause } from 'lucide-react';
import { NPWDButton } from '@npwd/keyos';
import { Button } from '@ui/components/Button';
import { Tooltip } from '@ui/components/Tooltip';
import { useRecorder } from '@os/audio/hooks/useRecorder';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

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

  const audioDuration = audioRef.current.duration;

  useEffect(() => {
    audioRef.current.src = recordedAudio;
  }, [recordedAudio]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.ontimeupdate = () => {
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
    stopRecording();
  };

  const handleSaveRecording = () => {
    if (!blob) return;
    setVoiceMessage(blob);
    closeModal();
  };

  return (
    <Modal visible={open} handleClose={closeModal}>
      <div className="flex items-center justify-start py-1">
        <div className="pl-1">
          {recordedAudio && !recordingState.isRecording ? (
            <InteractButtons play={play} pause={pause} playing={playing} />
          ) : (
            <RecordingButtons
              startRecording={handleStartRecord}
              stopRecording={handleStopRecording}
              isRecording={recordingState.isRecording}
            />
          )}
        </div>
        {!recordedAudio ? (
          <p className="text-keyos-cream">Record Voice Message</p>
        ) : recordingState.isRecording ? (
          <p className="text-keyos-cream">Recording...</p>
        ) : recordedAudio && !isNaN(audioDuration) ? (
          <div>
            <p className="text-keyos-cream">
              {dayjs.duration((currentTime ?? 0) * 1000).format('mm:ss')}
              {audioDuration === Infinity
                ? null
                : ` - ${dayjs.duration(Math.trunc(audioDuration) * 1000).format('mm:ss')}`}
            </p>
          </div>
        ) : (
          <p className="text-keyos-cream">Click to play voice message</p>
        )}
      </div>
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
  <div className="flex items-center gap-1">
    <Tooltip title="Record voice message">
      <NPWDButton
        size="icon"
        variant="ghost"
        disabled={isRecording}
        onClick={startRecording}
        className="text-red-500"
      >
        <Circle size={20} fill="currentColor" />
      </NPWDButton>
    </Tooltip>
    {isRecording && (
      <NPWDButton size="icon" variant="ghost" onClick={stopRecording} className="text-red-500">
        <Square size={18} fill="currentColor" />
      </NPWDButton>
    )}
  </div>
);

const InteractButtons: React.FC<InteractButtonsProps> = ({ playing, play, pause }) => (
  <div>
    <NPWDButton size="icon" variant="ghost" onClick={playing ? pause : play}>
      {playing ? <Pause size={20} /> : <Play size={20} />}
    </NPWDButton>
  </div>
);

export default RecordVoiceMessage;
