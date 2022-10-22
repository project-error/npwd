import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { GalleryPhoto, PhotoEvents } from '@typings/photo';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { photoState } from './state';
import { useNuiCallback } from 'fivem-nui-react-lib';
import { useNuiEvent } from '@common/hooks/useNuiEvent';

interface IUseCamera {
  photos: GalleryPhoto[];
  setPhotos: SetterOrUpdater<GalleryPhoto[]>;
  takePhoto: () => void;
  isLoading: boolean;
}

export const useCamera = (): IUseCamera => {
  const [t] = useTranslation();
  const { addAlert } = useSnackbar();

  const [photos, setPhotos] = useRecoilState<GalleryPhoto[]>(photoState.photos);

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

  const [_takePhoto] = useNuiCallback<void, GalleryPhoto>(
    'CAMERA',
    PhotoEvents.TAKE_PHOTO,
    onPhotoSuccess,
    onPhotoError,
  );

  useNuiEvent('CAMERA', PhotoEvents.UPLOAD_PHOTO, () => setUploading(true));
  useNuiEvent('CAMERA', PhotoEvents.CAMERA_EXITED, () => setUploading(false));

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
