import { useEffect, useState } from 'react';

type RecordingState = {
  mediaStream: MediaStream | null;
  recorder: MediaRecorder | null;
  isRecording: boolean;
};

interface RecorderProps {
  audio: string | null;
  recordingState: RecordingState;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

export const useRecorder = (): RecorderProps => {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    mediaStream: null,
    recorder: null,
    isRecording: null,
  });
  const [audio, setAudio] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const startRecording = async (): Promise<void> => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    setRecordingState((prev) => {
      return {
        ...prev,
        mediaStream: stream,
        recorder: mediaRecorder,
      };
    });
  };

  const stopRecording = (): void => {
    recordingState.recorder.stop();
    recordingState.mediaStream.getAudioTracks().forEach((track) => track.stop());
  };

  useEffect(() => {
    const audioRecorder = recordingState.recorder;
    let chunks = [];

    if (recordingState.recorder && recordingState.recorder.state === 'inactive') {
      audioRecorder.start();

      setRecordingState((prev) => {
        return {
          ...prev,
          isRecording: true,
        };
      });

      audioRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      audioRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg' });
        const blob_url = URL.createObjectURL(blob);

        setAudio(blob_url);
        setAudioBlob(blob);

        setRecordingState((prev) => {
          return {
            ...prev,
            isRecording: false,
            recorder: null,
            mediaStream: null,
          };
        });
      };
    }

    return () => {
      if (recordingState.recorder) {
        recordingState.recorder.stream.getAudioTracks().forEach((track) => track.stop());
      }
    };
  }, [recordingState.recorder]);

  return {
    audio,
    recordingState,
    startRecording,
    stopRecording,
  };
};
