import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../../ui/hooks/useSnackbar';
import { photoState } from './state';
import { useCallback, useState } from 'react';
import { useNuiCallback } from 'fivem-nui-react-lib';
import { GalleryPhoto, PhotoEvents } from '../../../../../typings/photo';
import { usePhotoService } from './usePhotoService';

/*
export const usePhotoActions = () => {
	const { t } = useTranslation();
	const { addAlert } = useSnackbar();

	const [photos, setPhotos] = usePhotoService();
	const [isUploading, setUploading] = useState(false);

	const onPhotoSuccess = useCallback((photo) => {
		setUploading(false);
		if (!photo?.image) return;
		setPhotos((curr) => [photo, ...curr]);
	}, [setPhotos])

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
		isLoading: isUploading
	}

}*/
