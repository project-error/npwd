import { useSetRecoilState } from 'recoil';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { photoState } from './state';
import { PhotoEvents } from '../../../../../typings/photo';

export const usePhotoService = () => {
  const setPhotos = useSetRecoilState(photoState.photos);
  useNuiEvent('CAMERA', PhotoEvents.SEND_PHOTOS, setPhotos);
};
