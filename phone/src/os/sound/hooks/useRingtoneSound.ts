import { useContext, useEffect, useMemo } from 'react';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import { soundContext } from '../providers/SoundProvider';
import { getSoundSettings } from '../utils/getSoundSettings';

export const useRingtoneSound = () => {
  const [settings] = useSettings();

  const context = useContext(soundContext);

  if (!context) {
    throw new Error('useRingtoneSound must be wrapped in SoundProvider');
  }

  const options = useMemo(() => getSoundSettings('ringtone', settings), [
    settings,
  ]);

  useEffect(() => {
    if (!context.isMounted(options.sound)) {
      context.mount(options.sound, options.volume, true);
      return;
    }
    context.volume(options.sound, options.volume);
  }, [context, options.sound, options.volume]);

  return {
    play: () => context.play(options.sound, options.volume, true),
    stop: () => context.stop(options.sound),
    playing: () => context.playing(options.sound),
  };
};
