import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { PhotoEvents } from '../../../../../typings/photo';
import { useNuiEvent, useNuiCallback } from 'fivem-nui-react-lib/dist/index';
import { useSnackbar } from '../../../ui/hooks/useSnackbar';
import { photoState } from './state';

export interface ICameraPhoto {
  id: string;
  image: string;
}

interface IUseCamera {
  photos: ICameraPhoto[];
  setPhotos: SetterOrUpdater<ICameraPhoto[]>;
  takePhoto: () => void;
  isLoading: boolean;
}

export const useCamera = (): IUseCamera => {
  const { t } = useTranslation();
  const { addAlert } = useSnackbar();

  const [photos, setPhotos] = useRecoilState<ICameraPhoto[] | null>(photoState.photos);

  const [isUploading, setUploading] = useState(false);

  const onPhotoSuccess = useCallback(
    (photo) => {
      setUploading(false);
      if (!photo?.image) return;
      setPhotos((curr) => [photo, ...curr]);
    },
    [setPhotos],
  );

  const onPhotoError = useCallback(
    (i18nKey) => {
      setUploading(false);
      addAlert({ type: 'error', message: t(i18nKey) });
    },
    [addAlert, t],
  );

  const [_takePhoto] = useNuiCallback<void, ICameraPhoto>(
    'CAMERA',
    PhotoEvents.TAKE_PHOTO,
    onPhotoSuccess,
    onPhotoError,
  );

  useNuiEvent('CAMERA', PhotoEvents.UPLOAD_PHOTO, () => setUploading(true));

  const takePhoto = () => {
    // Timeout at 1 minute
    _takePhoto(undefined, { timeout: 60000 });
  };

  return {
    photos,
    setPhotos,
    takePhoto,
    isLoading: isUploading,
  };
};
