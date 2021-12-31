import { useEffect, useMemo } from 'react';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import { getSoundSettings } from '../utils/getSoundSettings';
import { useSoundProvider } from './useSoundProvider';
import { useCurrentCallValue } from '@os/call/hooks/state';

export const useRingtoneSound = () => {
  const [settings] = useSettings();
  const call = useCurrentCallValue();
  const sound = useSoundProvider();

  if (!sound) {
    throw new Error('useRingtoneSound must be wrapped in SoundProvider');
  }

  const options = useMemo(() => getSoundSettings('ringtone', settings), [settings]);

  useEffect(() => {
    if (sound.playing(options.sound) && !call) {
      sound.stop(options.sound);
    }
  }, [call, options.sound, sound]);

  useEffect(() => {
    if (!sound.isMounted(options.sound)) {
      sound.mount(options.sound, options.volume, true);
      return;
    }
    sound.volume(options.sound, options.volume);
  }, [sound, options.sound, options.volume]);

  return {
    play: () => sound.play(options.sound, options.volume, true),
    stop: () => sound.stop(options.sound),
    playing: () => sound.playing(options.sound),
  };
};
