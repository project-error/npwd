import { atom, useAtom, useAtomValue } from 'jotai';
import { GalleryPhoto, PhotoEvents } from '@typings/photo';
import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import { isEnvBrowser } from '../../../utils/misc';
import { MockPhotoData } from '../utils/constants';
import { fetchNuiData } from '@common/query/fetch-nui-query';
import { useQueryState, useQueryStateValue, useSetQueryState } from '@common/query/query-state';

export const PHOTOS_QUERY_KEY = ['camera', 'photos'] as const;

const fetchPhotos = async () => {
  try {
    const photos = await fetchNuiData<GalleryPhoto[]>(PhotoEvents.FETCH_PHOTOS);
    LogDebugEvent({ action: 'PhotosFetched', data: photos });
    return photos;
  } catch (e) {
    if (isEnvBrowser()) {
      return MockPhotoData;
    }
    console.error(e);
    return [];
  }
};

export const photoState = {
  photos: PHOTOS_QUERY_KEY,
  isEditing: atom<boolean>(false),
  checkedPhotos: atom<number[]>([]),
};

export const useSetPhotos = () => useSetQueryState<GalleryPhoto[]>(PHOTOS_QUERY_KEY, []);
export const usePhotos = () => useQueryState<GalleryPhoto[]>(PHOTOS_QUERY_KEY, fetchPhotos, []);
export const usePhotosValue = () =>
  useQueryStateValue<GalleryPhoto[]>(PHOTOS_QUERY_KEY, fetchPhotos, []);

export const useIsEditing = () => useAtom(photoState.isEditing);
export const useIsEditingValue = () => useAtomValue(photoState.isEditing);

export const useCheckedPhotos = () => useAtom(photoState.checkedPhotos);
export const useCheckedPhotosValue = () => useAtomValue(photoState.checkedPhotos);
