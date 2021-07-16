import { usePhotos } from './state';
import { useCallback } from 'react';

export const usePhotoActions = () => {
  const [photos, setPhotos] = usePhotos();

  const takePhoto = useCallback(
    (photo) => {
      setPhotos((curPhotos) => [photo, ...curPhotos]);
    },
    [setPhotos],
  );

  const deletePhoto = useCallback(
    (image: string) => {
      setPhotos((curPhotos) => [...curPhotos].filter((meta) => meta.image !== image));
    },
    [setPhotos],
  );

  return {
    takePhoto,
    deletePhoto,
  };

  /*const { t } = useTranslation();
	const { addAlert } = useSnackbar();

	const [photos, setPhotos] = usePhotoService();
	const [isUploading, setUploading] = useState(false);*/
  /*
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
	
		const takePhoto = () => {
			_takePhoto(undefined, { timeout: 60000 });
		};
	
		return {
			photos,
			setPhotos,
			takePhoto,
			isLoading: isUploading,
		};*/
};
