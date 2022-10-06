import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ServerPromiseResp } from '@typings/common';
import { FetchPhotosRequest, GalleryPhoto, GalleryResponse, PhotoEvents } from '@typings/photo';
import fetchNui from '@utils/fetchNui';
import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import { isEnvBrowser } from '../../../utils/misc';
import { MockPhotoData } from '../utils/constants';

export const photoState = {
  photos: atom<GalleryResponse>({
    key: 'galleryPhotos',
    default: selector({
      key: 'defaultGalleryPhotos',
      get: async ({ get }) => {
        try {
          const currentPage = get(photoState.photosPage);
          const resp = await fetchNui<ServerPromiseResp<GalleryResponse>, FetchPhotosRequest>(
            PhotoEvents.FETCH_PHOTOS,
            { page: currentPage },
          );
          LogDebugEvent({ action: 'PhotosFetched', data: resp.data });
          return resp.data;
        } catch (e) {
          if (isEnvBrowser()) {
            return MockPhotoData;
          }
          console.error(e);
          return [];
        }
      },
    }),
  }),
  photosPage: atom<number>({
    key: 'galleryPhotosPage',
    default: 1,
  }),
  isEditing: atom<boolean>({
    key: 'galleryIsEditing',
    default: false,
  }),
  checkedPhotos: atom<number[]>({
    key: 'checkedPhotos',
    default: [],
  }),
};

export const useSetPhotos = () => useSetRecoilState<GalleryResponse>(photoState.photos);
export const usePhotos = () => useRecoilState<GalleryResponse>(photoState.photos);
export const usePhotosValue = () => useRecoilValue<GalleryResponse>(photoState.photos);

export const useIsEditing = () => useRecoilState(photoState.isEditing);
export const useIsEditingValue = () => useRecoilValue(photoState.isEditing);

export const useCheckedPhotos = () => useRecoilState<number[]>(photoState.checkedPhotos);
export const useCheckedPhotosValue = () => useRecoilValue<number[]>(photoState.checkedPhotos);

export const useSetCurrentPhotoPage = () => useSetRecoilState(photoState.photosPage);
