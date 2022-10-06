import React, { ChangeEvent } from 'react';
import { Box, Checkbox, IconButton, Pagination } from '@mui/material';
import useStyles from './grid.styles';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { addQueryToLocation } from '@common/utils/addQueryToLocation';
import { getLocationFromUrl } from '@common/utils/getLocationFromUrl';
import {
  usePhotosValue,
  useIsEditing,
  useCheckedPhotos,
  useSetCurrentPhotoPage,
} from '../../hooks/state';
import EditIcon from '@mui/icons-material/Edit';

export const GalleryGrid = () => {
  const classes = useStyles();
  const history = useHistory();
  const query = useQueryParams();
  const photos = usePhotosValue();
  const setPhotoPage = useSetCurrentPhotoPage();
  const [isEditing, setIsEditing] = useIsEditing();
  const [checkedPhotos, setCheckedPhotos] = useCheckedPhotos();

  const referal = query.referal ? decodeURIComponent(query.referal) : '/camera/image';

  const handlePhotoOpen = (photo) => {
    history.push(addQueryToLocation(getLocationFromUrl(referal), 'image', photo.image));
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const toggleCheck = (photoId: number) => {
    const currentIndex = checkedPhotos.indexOf(photoId);
    const newChecked = [...checkedPhotos];

    if (currentIndex === -1) {
      newChecked.push(photoId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedPhotos(newChecked);
  };

  const handleChangePage = (e: ChangeEvent<unknown>, val: number) => {
    setPhotoPage(val);
  };

  const imageLimitPerPage = 12;
  const pageCount = Math.ceil(photos.count / imageLimitPerPage);

  return (
    <div>
      <Box display="flex" flexWrap="wrap" alignContent="flex-start" className={classes.root}>
        {!!photos.images.length && (
          <Box position="absolute" top={10} right={3}>
            <IconButton sx={{ backgroundColor: '#232323' }} color="primary" onClick={toggleEdit}>
              <EditIcon />
            </IconButton>
          </Box>
        )}
        {photos.images.map((photo) => {
          return isEditing ? (
            <Box key={photo.id}>
              <div
                style={{ backgroundImage: `url(${photo.image})` }}
                className={classes.photo}
                onClick={() => toggleCheck(photo.id)}
              >
                <Checkbox checked={checkedPhotos.indexOf(photo.id) !== -1} />
              </div>
            </Box>
          ) : (
            <Box key={photo.id} onClick={() => handlePhotoOpen(photo)}>
              <div style={{ backgroundImage: `url(${photo.image})` }} className={classes.photo} />
            </Box>
          );
        })}
        <Box position="absolute" bottom={15} display="flex" justifyContent="center" width="100%">
          <Pagination count={pageCount} shape="rounded" onChange={handleChangePage} />
        </Box>
      </Box>
    </div>
  );
};
