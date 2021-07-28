import { useSetPhotos } from './state';
import { useCallback } from 'react';

export const usePhotoActions = () => {
  const setPhotos = useSetPhotos();

  const takePhoto = useCallback(
    (photo) => {
      setPhotos((curPhotos) => [photo, ...curPhotos]);
    },
    [setPhotos],
  );

  const deletePhoto = useCallback(
    (image: string) => {
      setPhotos((curPhotos) => [...curPhotos].filter((meta) => meta.image !== image));
    },
    [setPhotos],
  );

  return { takePhoto, deletePhoto };
};
