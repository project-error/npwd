export const setClipboard = (value: string) => {
  // 420 Blaze it
  // YOLO
  // Only live once for tonight
  const clipElem = document.createElement('input');
  clipElem.value = value;
  document.body.appendChild(clipElem);
  clipElem.select();
  document.execCommand('copy');
  document.body.removeChild(clipElem);
};
