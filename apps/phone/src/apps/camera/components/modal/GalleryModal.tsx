import React, { useMemo, useState, useCallback } from 'react';
import { ArrowLeft, Trash2, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { ShareModal } from './ShareModal';
import { GalleryPhoto, PhotoEvents } from '@typings/photo';
import { usePhotoActions } from '../../hooks/usePhotoActions';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { Button } from '@ui/components/Button';

export const GalleryModal = () => {
  const [shareOpen, setShareOpen] = useState(null);

  const navigate = useNavigate();
  const query = useQueryParams();
  const { deletePhoto } = usePhotoActions();
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();

  const referal = query.referal || '/camera';

  const meta: GalleryPhoto = useMemo(
    () => ({ id: parseInt(query.id), image: query.image as string }),
    [query],
  );

  const _handleClose = () => {
    navigate(referal);
  };

  const handleDeletePhoto = () => {
    fetchNui<ServerPromiseResp<GalleryPhoto>>(PhotoEvents.DELETE_PHOTO, {
      image: meta.image,
    }).then((serverResp) => {
      if (serverResp.status !== 'ok') {
        return addAlert({ message: t('CAMERA.FAILED_TO_DELETE'), type: 'error' });
      }

      deletePhoto(meta.image);

      navigate(-1);
    });
  };

  const handleSharePhoto = useCallback(() => {
    setShareOpen(meta);
  }, [meta]);

  if (!meta) return null;

  return (
    <>
      <ShareModal referal={referal} meta={shareOpen} onClose={() => setShareOpen(null)} />
      <div className="absolute h-full w-full">
        {shareOpen && (
          <div className="absolute inset-0 z-[5] bg-black/60" />
        )}
        <Button onClick={_handleClose} variant="text">
          <ArrowLeft />
        </Button>
        <div
          className="mx-auto mt-16 h-[380px] max-h-[380px] w-auto bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${meta.image})` }}
        />
        <div className="mt-4 flex justify-evenly">
          <Button onClick={handleDeletePhoto} variant="text">
            <Trash2 size={28} />
          </Button>
          <Button onClick={handleSharePhoto} variant="text">
            <Share2 size={28} />
          </Button>
        </div>
      </div>
    </>
  );
};
