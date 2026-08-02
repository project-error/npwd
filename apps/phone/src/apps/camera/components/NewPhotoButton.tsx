import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useIsEditing } from '../hooks/state';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { GalleryPhoto, PhotoEvents } from '@typings/photo';
import { usePhotoActions } from '../hooks/usePhotoActions';
import { useCheckedPhotosValue } from '../hooks/state';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { Button } from '@npwd/keyos';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

const NewPhotoButton = () => {
  const [isEditing, setIsEditing] = useIsEditing();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const checkedPhotos = useCheckedPhotosValue();
  const { takePhoto, deletePhotos } = usePhotoActions();
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();

  const handleTakePhoto = () => {
    setIsLoading(true);
    fetchNui<ServerPromiseResp<GalleryPhoto>>(PhotoEvents.TAKE_PHOTO).then((serverResp) => {
      if (serverResp.status !== 'ok') {
        setIsLoading(false);
        return addAlert({
          message: t(serverResp.errorMsg),
          type: 'error',
        });
      }

      takePhoto(serverResp.data);
      setIsLoading(false);
    });
  };

  const handleDeletePhotos = () => {
    fetchNui<ServerPromiseResp<number[]>>(PhotoEvents.DELETE_MULTIPLE_PHOTOS, checkedPhotos).then(
      (serverResp) => {
        if (serverResp.status !== 'ok') {
          return addAlert({ message: t('CAMERA.FAILED_TO_DELETE'), type: 'error' });
        }
        deletePhotos(checkedPhotos);
        setIsEditing(false);
      },
    );
  };

  if (isLoading)
    return (
      <Button
        className="absolute bottom-10 right-6 z-50 rounded-2xl bg-[color:var(--keyos-app-accent)] text-[color:var(--keyos-app-accent-foreground)] shadow-keyos-glow"
        disabled
        size="icon"
      >
        <LoadingSpinner height="auto" className="size-6" />
      </Button>
    );

  return (
    <Button
      className="absolute bottom-10 right-6 z-50 rounded-2xl bg-[color:var(--keyos-app-accent)] text-[color:var(--keyos-app-accent-foreground)] shadow-keyos-glow hover:brightness-110"
      onClick={!isEditing ? handleTakePhoto : handleDeletePhotos}
      size="icon"
    >
      {!isEditing ? <Plus /> : <Trash2 className="text-red-500" />}
    </Button>
  );
};

export default NewPhotoButton;
