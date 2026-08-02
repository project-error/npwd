import React from 'react';
import { useNavigate } from 'react-router';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { addQueryToLocation } from '@common/utils/addQueryToLocation';
import { getLocationFromUrl } from '@common/utils/getLocationFromUrl';
import { usePhotosValue, useIsEditing, useCheckedPhotos } from '../../hooks/state';
import { Pencil } from 'lucide-react';
import { cn } from '@utils/css';

const photoClass =
  'h-[129px] w-[129px] max-h-[150px] max-w-[150px] border border-inset border-white bg-cover bg-center bg-no-repeat';

export const GalleryGrid = () => {
  const navigate = useNavigate();
  const query = useQueryParams();
  const photos = usePhotosValue();
  const [isEditing, setIsEditing] = useIsEditing();
  const [checkedPhotos, setCheckedPhotos] = useCheckedPhotos();

  const referal = query.referal ? decodeURIComponent(query.referal) : '/camera/image';

  const handlePhotoOpen = (photo) => {
    navigate(addQueryToLocation(getLocationFromUrl(referal), 'image', photo.image));
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

  return (
    <div>
      <div className="relative flex flex-grow flex-wrap content-start">
        {!!photos.length && (
          <div className="absolute right-3 top-2.5">
            <button
              type="button"
              aria-label="Edit photos"
              className="rounded-full p-2 text-keyos-fg transition-colors hover:bg-white/10"
              onClick={toggleEdit}
            >
              <Pencil />
            </button>
          </div>
        )}
        {photos.map((photo) => {
          return isEditing ? (
            <div key={photo.id}>
              <div
                style={{ backgroundImage: `url(${photo.image})` }}
                className={cn(photoClass, 'cursor-pointer')}
                onClick={() => toggleCheck(photo.id)}
              >
                <input
                  type="checkbox"
                  checked={checkedPhotos.indexOf(photo.id) !== -1}
                  readOnly
                  className="size-5 accent-[color:var(--keyos-app-accent)]"
                />
              </div>
            </div>
          ) : (
            <div key={photo.id} onClick={() => handlePhotoOpen(photo)} className="cursor-pointer">
              <div style={{ backgroundImage: `url(${photo.image})` }} className={photoClass} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
