import React from 'react'
import { usePhotoMeta } from '../../hooks/usePhotoMeta';
import { usePhotoModal } from '../../hooks/usePhotoModal';
import useStyles from './modal.styles';
import { Button, Paper } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import Nui from '../../../../os/nui-events/utils/Nui';
import { useShareModal } from '../../hooks/useShareModal';
import { ShareModal } from './ShareModal';
import { useShareLink } from '../../hooks/useShareLink';

export const GalleryModal = () => {

  const { meta, setMeta } = usePhotoMeta();
  const { modal, setModal } = usePhotoModal();
  const classes = useStyles();

  const { shareModal ,setShareModal } = useShareModal();
  const { setShareLink } = useShareLink();


  const _handleClose = () => {
    setModal(false)
    setMeta(null);
  }

  const handleDeletePhoto = () => {
    console.log(meta.id)
    Nui.send('photo:deletePhoto', {
      id: meta.id
    })
    setModal(false)
  }

  const handleSharePhoto = () => {
    setShareModal(true)
    setShareLink(meta.image)
  }
 
  if(!meta) return null;

  return (
    <Paper className={modal ? classes.modal : classes.modalHide}>
      <ShareModal key={meta.id} {...meta}/>
      <div className={shareModal ? classes.backgroundModal : undefined} />
      <Button onClick={_handleClose}><ArrowBackIcon /></Button>
      <div className={classes.image} style={{ backgroundImage: `url(${meta.image})`}} />
      <div className={classes.actionDiv}>
        <Button onClick={handleDeletePhoto}>
          <DeleteIcon fontSize="large" />
        </Button>
        <Button onClick={handleSharePhoto}>
          <ShareIcon fontSize="large" />
        </Button>
      </div>
    </Paper>
  )
}
