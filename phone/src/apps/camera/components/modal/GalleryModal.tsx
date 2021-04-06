import React, { useMemo, useState, useCallback } from 'react';
import useStyles from './modal.styles';
import { Button, Paper } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { ICameraPhoto } from '../../hooks/usePhotos';
import { ShareModal } from './ShareModal';
import { PhotoEvents } from '../../../../../../typings/photo';
import { useNuiRequest } from 'fivem-nui-react-lib';

export const GalleryModal = () => {
  const Nui = useNuiRequest();
  const classes = useStyles();
  const history = useHistory();
  const query = useQueryParams();
  const referal = query.referal || '/camera';

  const [shareOpen, setShareOpen] = useState(null);

  const meta: ICameraPhoto = useMemo(
    () => ({ id: query.id as string, image: query.image as string }),
    [query],
  );

  const _handleClose = () => {
    history.push(referal);
  };

  const handleDeletePhoto = () => {
    Nui.send(PhotoEvents.DELETE_PHOTO, {
      image: meta.image,
    });
    history.push(referal);
  };

  const handleSharePhoto = useCallback(() => {
    setShareOpen(meta);
  }, [meta]);

  if (!meta) return null;

  return (
    <>
      <ShareModal referal={referal} meta={shareOpen} onClose={() => setShareOpen(null)} />
      <Paper className={classes.modal}>
        <div className={shareOpen ? classes.backgroundModal : null} />
        <Button onClick={_handleClose}>
          <ArrowBackIcon />
        </Button>
        <div className={classes.image} style={{ backgroundImage: `url(${meta.image})` }} />
        <div className={classes.actionDiv}>
          <Button onClick={handleDeletePhoto}>
            <DeleteIcon fontSize="large" />
          </Button>
          <Button onClick={handleSharePhoto}>
            <ShareIcon fontSize="large" />
          </Button>
        </div>
      </Paper>
    </>
  );
};
