import React from 'react';
import { Box, Button } from '@material-ui/core';
import useStyles from './grid.styles';
import { usePhotos } from '../../hooks/usePhotos';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { addQueryToLocation } from '../../../../common/utils/addQueryToLocation';
import { getLocationFromUrl } from '../../../../common/utils/getLocationFromUrl';
import { PhotoEvents } from '../../../../../../typings/photo';
import { useNuiRequest } from 'fivem-nui-react-lib';

export const GalleryGrid = () => {
  const Nui = useNuiRequest();
  const classes = useStyles();
  const history = useHistory();
  const query = useQueryParams();

  const referal = query.referal ? decodeURIComponent(query.referal) : '/camera/image';

  const photos = usePhotos();

  const handleCamera = () => {
    Nui.send(PhotoEvents.TAKE_PHOTO, {});
  };

  const handlePhotoOpen = (photo) => {
    history.push(addQueryToLocation(getLocationFromUrl(referal), 'image', photo.image));
  };

  if (!photos)
    return (
      <Box display="flex" flexWrap="wrap" alignContent="flex-start" className={classes.root}>
        <Box>
          <Button onClick={handleCamera} style={{ borderRadius: 0 }} className={classes.photo}>
            <AddIcon fontSize="large" />
          </Button>
        </Box>
      </Box>
    );

  return (
    <div>
      <Box display="flex" flexWrap="wrap" alignContent="flex-start" className={classes.root}>
        <Box>
          <Button onClick={handleCamera} style={{ borderRadius: 0 }} className={classes.photo}>
            <AddIcon fontSize="large" />
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
