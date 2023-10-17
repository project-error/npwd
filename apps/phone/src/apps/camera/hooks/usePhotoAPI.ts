import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { GalleryPhoto, PhotoEvents } from '@typings/photo';
import fetchNui from '@utils/fetchNui';
import { useTranslation } from 'react-i18next';
import { usePhotoActions } from './usePhotoActions';

export const usePhotoAPI = () => {
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();
  const { saveLocalImage } = usePhotoActions();
  const saveImage = (imageUrl: string) => {
    fetchNui<ServerPromiseResp<GalleryPhoto>>(PhotoEvents.SAVE_IMAGE, { url: imageUrl }).then(
      (res) => {
        if (res.status !== 'ok') {
          return addAlert({
            type: 'error',
            message: t('CAMERA.FAILED_TO_TAKE_PHOTO'),
          });
        }

        saveLocalImage(res.data);
      },
    );
  };

  return {
    saveImage,
  };
};
