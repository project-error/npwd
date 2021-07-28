import { useCallback, useEffect } from 'react';
import { useSoundProvider } from '../../sound/hooks/useSoundProvider';

interface useDialingSoundValue {
  startDialTone: () => void;
  endDialTone: () => void;
}

const DIAL_TONE_URL = 'media/misc/Outgoing-Dial-Effect.ogg';

export const useDialingSound = (): useDialingSoundValue => {
  const sound = useSoundProvider();

  useEffect(() => {
    if (!sound.isMounted(DIAL_TONE_URL)) {
      sound.mount(DIAL_TONE_URL, 0.3, true);
      return;
    }
    sound.volume(DIAL_TONE_URL, 0.3);
  }, [sound]);

  const startDialTone = useCallback(() => {
    sound.play(DIAL_TONE_URL, 0.3, true);
  }, [sound]);

  const endDialTone = useCallback(() => {
    sound.stop(DIAL_TONE_URL);
  }, [sound]);

  return { startDialTone, endDialTone };
};
