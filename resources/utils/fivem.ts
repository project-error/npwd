// https://forum.cfx.re/t/typescript-vs-lua-questions/612483/11
export const Delay = (ms: number) => new Promise(res => setTimeout(res, ms));