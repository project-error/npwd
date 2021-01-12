import { useSetRecoilState } from 'recoil';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { photoState } from './state';
import { usePhotos } from './usePhotos';

export const usePhotoService = () => {
  const setPhotos = useSetRecoilState(photoState.photos);
  useNuiEvent('CAMERA', 'setPhotos', setPhotos);
  return usePhotos();
};
