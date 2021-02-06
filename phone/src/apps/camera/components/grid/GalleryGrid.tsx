import React from 'react';
import { Box, Button } from '@material-ui/core';
import useStyles from './grid.styles';
import { usePhotos } from '../../hooks/usePhotos';
import AddIcon from '@material-ui/icons/Add';
import Nui from '../../../../os/nui-events/utils/Nui';
import { useHistory } from 'react-router-dom';
import * as qs from 'qs';

export const GalleryGrid = ({ referal = '/camera/image' }) => {
  const classes = useStyles();
  const history = useHistory();

  const photos = usePhotos();

  const handleCamera = () => {
    Nui.send('phone:TakePhoto', {});
  };

  const handlePhotoOpen = (photo) => {
    history.push(`${referal}?${qs.stringify(photo)}`);
  };

  if (!photos)
    return (
      <Box
        display='flex'
        flexWrap='wrap'
        alignContent='flex-start'
        className={classes.root}
      >
        <Box>
          <Button
            onClick={handleCamera}
            style={{ borderRadius: 0 }}
            className={classes.photo}
          >
            <AddIcon fontSize='large' />
          </Button>
        </Box>
      </Box>
    );

  return (
    <div>
      <Box
        display='flex'
        flexWrap='wrap'
        alignContent='flex-start'
        className={classes.root}
      >
        <Box>
          <Button
            onClick={handleCamera}
            style={{ borderRadius: 0 }}
            className={classes.photo}
          >
            <AddIcon fontSize='large' />
          </Button>
        </Box>
        {photos.map((photo) => (
          <Box onClick={() => handlePhotoOpen(photo)}>
            <div
              style={{ backgroundImage: `url(${photo.image})` }}
              className={classes.photo}
            />
          </Box>
        ))}
      </Box>
    </div>
  );
};
