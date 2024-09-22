import { clsx } from 'clsx';
import { useState } from 'react';

interface SelectImagesFormProps {
  images: string[];
  selectedImages: string[];
  onSelectedImagesChanged: (images: string[]) => void;
}

export const SelectImagesForm = ({
  images,
  selectedImages: initialSelectedImages,
  onSelectedImagesChanged,
}: SelectImagesFormProps) => {
  const [selectedImages, setSelectedImages] = useState<string[]>(initialSelectedImages);

  const handleSetImages = (images: string[]) => {
    setSelectedImages(images);
    onSelectedImagesChanged(images);
  };

  const handleSelectImage = (src: string) => {
    const newImages = [...selectedImages, src];
    handleSetImages(newImages);
  };

  const handleRemoveImage = (src: string) => {
    const newImages = selectedImages.filter((image) => image !== src);
    handleSetImages(newImages);
  };

  const handleToggleImage = (src: string) => {
    if (selectedImages.includes(src)) {
      handleRemoveImage(src);
    } else {
      handleSelectImage(src);
    }
  };

  return (
    <div className="grid grid-cols-3 overflow-auto max-h-96 gap-0.5 select-none">
      {images.map((image) => {
        const index = selectedImages.findIndex((src) => src === image);
        const selected = index !== -1;

        return (
          <div
            key={image}
            tabIndex={0}
            className="relative cursor-pointer focus-visible:ring-2"
            onClick={() => handleToggleImage(image)}
            onKeyDown={(e) => e.key === 'Enter' && handleToggleImage(image)}
          >
            <div
              className={clsx(
                'absolute w-full h-full top-0 right-0 flex bg-black bg-opacity-50 transition-opacity duration-200',
                selected ? 'opacity-50' : 'opacity-0',
              )}
            />

            {selected && (
              <div className="bg-secondary text-secondary absolute rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex justify-center items-center border border-secondary">
                <span className="font-light text-sm">{index + 1}</span>
              </div>
            )}

            <img
              src={image}
              alt="random"
              className={clsx('w-full object-cover object-center aspect-square')}
            />
          </div>
        );
      })}

      {images.length === 0 && (
        <div className="col-span-3 flex justify-center items-center text-secondary h-40 text-xl">
          No images available
        </div>
      )}
    </div>
  );
};
