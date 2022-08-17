import { useEffect, useState } from 'react';

type RecordingState = {
  mediaStream: MediaStream | null;
  recorder: MediaRecorder | null;
  isRecording: boolean;
};

interface RecorderProps {
  blob: Blob | null;
  audio: string | null;
  recordingState: RecordingState;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

export const useRecorder = (): RecorderProps => {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    mediaStream: null,
    recorder: null,
    isRecording: false,
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
    recordingState.recorder.stream.getAudioTracks().forEach((track) => track.stop());
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

        setRecordingState((prev) => {
          return {
            ...prev,
            isRecording: false,
            recorder: null,
            mediaStream: null,
          };
        });

        console.log('blob url', blob_url);

        setAudio(blob_url);
        setAudioBlob(blob);
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
    blob: audioBlob,
    recordingState,
    startRecording,
    stopRecording,
  };
};
