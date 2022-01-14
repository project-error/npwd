import { useCallback, useEffect } from 'react';
import { useSoundProvider } from '@os/sound/hooks/useSoundProvider';
import { useSettings } from '../../../apps/settings/hooks/useSettings';

interface useDialingSoundValue {
  startDialTone: () => void;
  endDialTone: () => void;
}

const DIAL_TONE_URL = 'media/misc/Outgoing-Dial-Effect.ogg';

export const useDialingSound = (): useDialingSoundValue => {
  const sound = useSoundProvider();
  const [settings] = useSettings();

  useEffect(() => {
    if (!sound.isMounted(DIAL_TONE_URL)) {
      sound.mount(DIAL_TONE_URL, settings.ringtoneVol / 100, true);
      return;
    }
    sound.volume(DIAL_TONE_URL, settings.ringtoneVol / 100);
  }, [sound, settings]);

  const startDialTone = useCallback(() => {
    sound.play(DIAL_TONE_URL, settings.ringtoneVol / 100, true);
  }, [sound, settings]);

  const endDialTone = useCallback(() => {
    sound.stop(DIAL_TONE_URL);
  }, [sound]);

  return { startDialTone, endDialTone };
};
