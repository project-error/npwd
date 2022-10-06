import React, { useState } from 'react';
import { Add, Delete } from '@mui/icons-material';
import { Fab, CircularProgress } from '@mui/material';
import { useIsEditing } from '../hooks/state';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { GalleryPhoto, PhotoEvents } from '@typings/photo';
import { usePhotoActions } from '../hooks/usePhotoActions';
import { useCheckedPhotosValue } from '../hooks/state';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/system';

const FloatBtn = styled(Fab)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(5),
  right: theme.spacing(3),
}));

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
        // We do early returns so we want to unset the loading here
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
      <FloatBtn color="primary" disabled={true}>
        <CircularProgress />
      </FloatBtn>
    );

  return (
    <FloatBtn color="primary" onClick={!isEditing ? handleTakePhoto : handleDeletePhotos}>
      {!isEditing ? <Add /> : <Delete />}
    </FloatBtn>
  );
};

export default NewPhotoButton;
