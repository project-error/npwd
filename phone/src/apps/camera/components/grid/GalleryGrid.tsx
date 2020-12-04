import React from 'react'
import { Box, Button } from '@material-ui/core';
import useStyles from './grid.styles';
import { usePhotos } from '../../hooks/usePhotos';
import AddIcon from '@material-ui/icons/Add';
import Nui from '../../../../os/nui-events/utils/Nui';
import { usePhotoModal } from '../../hooks/usePhotoModal';
import { usePhotoMeta } from '../../hooks/usePhotoMeta';
import { useModal } from '../../../contacts/hooks/useModal';
//import { useHistory } from 'react-router-dom';

// isMessage will work as a style handler kinda. If the gallery is rendered in the messages,
// it will have the value true, which basically means a tweak on the design to fit in a modal
export const GalleryGrid = (isMessags) => {
  const classes = useStyles()
  
  const { setMeta } = usePhotoMeta();
  const { setModal } = usePhotoModal();

  //let history = useHistory();
  
  const photos = usePhotos();

  console.log(photos)

  const handleCamera = () => {
    Nui.send('phone:TakePhoto', {})
  }

  const handlePhotoOpen = (photo) => {
    setModal(true)
    setMeta(photo)
    //history.push('/camera/image')
  }

  if(!photos) return (
    <Box display="flex" flexWrap="wrap" alignContent="flex-start" className={classes.root}>
        <Box>
          <Button onClick={handleCamera} style={{ borderRadius: 0 }} className={classes.photo}>
            <AddIcon fontSize="large"/>
          </Button>
        </Box>
      </Box>
  )

  return (
    <div>
      <Box display="flex" flexWrap="wrap" alignContent="flex-start" className={classes.root}>
        <Box>
          <Button onClick={handleCamera} style={{ borderRadius: 0 }} className={classes.photo}>
            <AddIcon fontSize="large"/>
          </Button>
        </Box>
        {photos.map(photo => (
          <Box onClick={() => handlePhotoOpen(photo)}>
            <div style={{ backgroundImage: `url(${photo.image})` }} className={classes.photo} />
          </Box>
        ))}
      </Box>
    </div>
  )
}
