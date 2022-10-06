import { photoState, useSetPhotos } from './state';
import { useCallback } from 'react';
import { useRecoilCallback } from 'recoil';
import { GalleryPhoto } from '@typings/photo';

export const usePhotoActions = () => {
  const setPhotos = useSetPhotos();

  const takePhoto = useCallback(
    (photo) => {
      setPhotos((curVal) => ({
        ...curVal,
        images: [photo, ...curVal.images],
      }));
    },
    [setPhotos],
  );

  const deletePhoto = useCallback(
    (image: string) => {
      setPhotos((curVal) => ({
        ...curVal,
        images: [...curVal.images].filter((meta) => meta.image !== image),
      }));
    },
    [setPhotos],
  );

  const deletePhotos = useCallback(
    (photoIds: number[]) => {
      setPhotos((curVal) => ({
        ...curVal,
        images: [...curVal.images].filter((photo) => !photoIds.includes(photo.id)),
      }));
    },
    [setPhotos],
  );

  const saveLocalImage = useRecoilCallback<[GalleryPhoto], void>(
    ({ snapshot }) =>
      async (dto) => {
        const { state } = await snapshot.getLoadable(photoState.photos);
        if (state !== 'hasValue') return;

        setPhotos((curVal) => ({
          ...curVal,
          images: [dto, ...curVal.images],
        }));
      },
    [setPhotos],
  );

  return { takePhoto, deletePhoto, saveLocalImage, deletePhotos };
};
