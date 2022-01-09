import React, { useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import useStyles from './grid.styles';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { addQueryToLocation } from '@common/utils/addQueryToLocation';
import { getLocationFromUrl } from '@common/utils/getLocationFromUrl';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { GalleryPhoto, PhotoEvents } from '@typings/photo';
import { usePhotoActions } from '../../hooks/usePhotoActions';
import { usePhotosValue } from '../../hooks/state';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';

export const GalleryGrid = () => {
  const classes = useStyles();
  const history = useHistory();
  const query = useQueryParams();
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();
  const photos = usePhotosValue();
  const { takePhoto } = usePhotoActions();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const referal = query.referal ? decodeURIComponent(query.referal) : '/camera/image';

  const handlePhotoOpen = (photo) => {
    history.push(addQueryToLocation(getLocationFromUrl(referal), 'image', photo.image));
  };

  const handleTakePhoto = () => {
    setIsLoading(true);
    fetchNui<ServerPromiseResp<GalleryPhoto>>(PhotoEvents.TAKE_PHOTO).then((serverResp) => {
      if (serverResp.status !== 'ok') {
        return addAlert({
          message: t('CAMERA.FAILED_TO_TAKE_PHOTO'),
          type: 'error',
        });
      }

      takePhoto(serverResp.data);
      setIsLoading(false);
    });
  };

  if (!photos)
    return (
      <Box display="flex" flexWrap="wrap" alignContent="flex-start" className={classes.root}>
        <Box>
          <Button onClick={takePhoto} style={{ borderRadius: 0 }} className={classes.photo}>
            <AddIcon fontSize="large" />
          </Button>
        </Box>
      </Box>
    );

  return (
    <div>
      <Box display="flex" flexWrap="wrap" alignContent="flex-start" className={classes.root}>
        <Box>
          <Button
            disabled={isLoading}
            onClick={handleTakePhoto}
            style={{ borderRadius: 0 }}
            className={classes.photo}
          >
            {!isLoading ? <AddIcon fontSize="large" /> : <CircularProgress />}
          </Button>
        </Box>
        {photos.map((photo) => (
          <Box key={photo.id} onClick={() => handlePhotoOpen(photo)}>
            <div style={{ backgroundImage: `url(${photo.image})` }} className={classes.photo} />
          </Box>
        ))}
      </Box>
    </div>
  );
};
