import React, { useEffect, useRef, useState } from 'react';
import { useRecorder } from '@os/audio/hooks/useRecorder';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useAudioMessageAPI } from '@apps/messages/hooks/useAudioMessageAPI';
import { Button, Tooltip } from '@npwd/keyos';
import { Circle, Pause, Play, Send, Square, X } from 'lucide-react';

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
      <div className="flex h-14 items-center justify-center border-t border-white/10 bg-keyos-panel">
        <div className="size-7 animate-spin rounded-full border-2 border-keyos-muted/30 border-t-[color:var(--keyos-app-accent)]" />
      </div>
    );
  }

  return (
    <div className="border-t border-white/10 bg-keyos-panel px-3 py-2 shadow-keyos-panel">
      <div className="flex items-center justify-between gap-3">
        <div>
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
          <p className="text-sm text-keyos-muted">Record voice message</p>
        ) : recordingState.isRecording ? (
          <p className="text-sm text-red-200">Recording...</p>
        ) : recordedAudio && !isNaN(duration) ? (
          <div>
            <p className="text-sm text-keyos-cream">
              {dayjs.duration(currentTime * 1000).format('mm:ss')}
              {duration === Infinity
                ? null
                : ` - ${dayjs.duration(Math.trunc(duration) * 1000).format('mm:ss')}`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-keyos-muted">Click to play voice message</p>
        )}
        <div className="flex items-center gap-1">
          {!recordingState.isRecording && recordedAudio && blob && (
            <Button onClick={handleSendRecording} size="icon" variant="ghost">
              <Send size={18} />
            </Button>
          )}
          <Button disabled={recordingState.isRecording} size="icon" onClick={onClose} variant="ghost">
            <X size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

const RecordingButtons: React.FC<RecordingButtonsProps> = ({
  isRecording,
  startRecording,
  stopRecording,
}) => (
  <div className="flex items-center gap-1">
      <Tooltip title="Record voice message">
        <Button disabled={isRecording} size="icon" variant="ghost" onClick={startRecording}>
          <Circle className="text-red-400" size={18} />
        </Button>
      </Tooltip>
      {isRecording && (
        <Button size="icon" variant="ghost" onClick={stopRecording}>
          <Square className="text-red-400" size={18} />
        </Button>
      )}
  </div>
);

const InteractButtons: React.FC<InteractButtonsProps> = ({ playing, play, pause }) => (
  <div>
    <Button size="icon" variant="ghost" onClick={playing ? pause : play}>
      {playing ? <Pause size={18} /> : <Play size={18} />}
    </Button>
  </div>
);

export default AudioContextMenu;
