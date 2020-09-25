export function withValidMedia(link, onSuccess) {
  // only add the media if it's a valid URL
  const image = new Image();
  image.onload = onSuccess;
  image.onerror = () => {
    console.warn(`Invalid image submitted: ${link}`);
  };
  image.src = link;
}
