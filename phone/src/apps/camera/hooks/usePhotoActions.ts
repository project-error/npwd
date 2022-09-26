import { photoState, useSetPhotos } from './state';
import { useCallback } from 'react';
import { useRecoilCallback } from 'recoil';
import { GalleryPhoto } from '@typings/photo';

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

  const deletePhotos = useCallback(
    (photoIds: number[]) => {
      setPhotos((curPhotos) => [...curPhotos].filter((photo) => !photoIds.includes(photo.id)));
    },
    [setPhotos],
  );

  const saveLocalImage = useRecoilCallback<[GalleryPhoto], void>(
    ({ snapshot }) =>
      async (dto) => {
        const { state } = await snapshot.getLoadable(photoState.photos);
        if (state !== 'hasValue') return;

        setPhotos((curVal) => [dto, ...curVal]);
      },
    [setPhotos],
  );

  return { takePhoto, deletePhoto, saveLocalImage, deletePhotos };
};
