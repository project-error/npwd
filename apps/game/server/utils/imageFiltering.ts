import { config } from '@npwd/config/server';

export const checkAndFilterImage = (imageUrl: string): string | null => {
  const image = imageUrl.trim();
  if (image == '') {
    return image;
  }

  // If we don't care about filtering images just return the image
  if (!config.imageSafety.filterUnsafeImageUrls) return image;

  const hostname = new URL(imageUrl).hostname;
  // We have an allowed image url!
  if (config.imageSafety.safeImageUrls.includes(hostname)) return image;

  // Embed unsafe urls so we don't accidentally expose our users IP address
  if (config.imageSafety.embedUnsafeImages) return `${config.imageSafety.embedUrl}?url=${imageUrl}`;

  return null;
};
