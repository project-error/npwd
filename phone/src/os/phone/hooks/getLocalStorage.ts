export const getStorageItem = (key: string) => {
  const UNIQ_PREFIX = 'npwd_phone_';
  try {
    const data = window.localStorage.getItem(UNIQ_PREFIX + key);
    // return stored or initValue if none stored
    return JSON.parse(data);
  } catch (e) {
    // TODO: Integrate debug error state here
    console.log(e);
    // We still return initVal if error is thrown
  }
};
