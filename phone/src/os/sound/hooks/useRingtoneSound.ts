import { useCallback, useContext, useEffect, useMemo } from 'react';
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

  const play = useCallback(() => {
    context.play(options.sound, options.volume, true);
  }, [context, options.sound, options.volume]);

  const stop = useCallback(() => {
    context.stop(options.sound);
  }, [context, options.sound]);

  const playing = useCallback(() => {
    return context.playing(options.sound);
  }, [context, options.sound]);

  return useMemo(
    () => ({
      play,
      stop,
      playing,
    }),
    [play, playing, stop]
  );
};
