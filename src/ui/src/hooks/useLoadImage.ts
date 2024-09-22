import { useEffect, useState } from 'react';

export const useLoadImage = (src?: string) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const loadImage = (src: string) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      setIsLoaded(true);
    };
  };

  useEffect(() => {
    setIsLoaded(false);

    if (!src) {
      return;
    }

    loadImage(src);
  }, [src]);

  return isLoaded;
};
