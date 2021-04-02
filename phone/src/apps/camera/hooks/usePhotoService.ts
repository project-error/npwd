import { useSetRecoilState } from 'recoil';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { photoState } from './state';
import { PhotoEvents } from '../../../../../typings/photo';

export const usePhotoService = () => {
  const setPhotos = useSetRecoilState(photoState.photos);
  useNuiEvent('CAMERA', PhotoEvents.SEND_PHOTOS, setPhotos);
};
