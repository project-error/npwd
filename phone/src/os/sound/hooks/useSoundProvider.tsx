import { useContext } from 'react';
import { soundContext } from '../providers/SoundProvider';

export const useSoundProvider = () => {
  return useContext(soundContext);
};
