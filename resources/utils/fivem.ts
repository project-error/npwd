// https://forum.cfx.re/t/typescript-vs-lua-questions/612483/11
export const Delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

// Credits to d0p3t
// https://github.com/d0p3t/fivem-js/blob/master/src/utils/UUIDV4.ts
export const uuidv4 = (): string => {
  let uuid = '';
  for (let ii = 0; ii < 32; ii += 1) {
    switch (ii) {
      case 8:
      case 20:
        uuid += '-';
        uuid += ((Math.random() * 16) | 0).toString(16);
        break;
      case 12:
        uuid += '-';
        uuid += '4';
        break;
      case 16:
        uuid += '-';
        uuid += ((Math.random() * 4) | 8).toString(16);
        break;
      default:
        uuid += ((Math.random() * 16) | 0).toString(16);
    }
  }
  return uuid;
};
