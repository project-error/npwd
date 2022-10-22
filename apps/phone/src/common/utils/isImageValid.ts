/**
 * Returns a Promise that validates that the URL successfully
 * loads in the browser. If the URL doesn't load the promise is
 * rejected.
 * @param {string} link - a URL we are trying to validate
 * @returns {Promise<string>} link - Will resolve the promise with the link string
 * if valid. Will reject if failed.
 */
export function isImageValid(link: string): Promise<string> {
  return new Promise((res, rej) => {
    const image = new Image();
    image.src = link;
    image.onerror = () => rej(`Invalid image, ${link}`);
    image.onload = () => res(link);
  });
}
