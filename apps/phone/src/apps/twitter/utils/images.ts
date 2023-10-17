// this is a hack. We are saving images in the database as
// delimiter separated URLS, but most common delimiters (comma, pipe
// hash, etc.) are often found in URLS (even though it's not technically
// within specification). To get around this we have our own delimiter
// here we'll use to join and split these strings
export const IMAGE_DELIMITER = '||!||';
