// Will apply any type to source
export const getSource = (): number => global.source;

// Will clean string of any character that isn't 0-9, or a-z
export const clean = (input: string): string => (input ? input.replace(/[^0-9a-z]/gi, '') : input);

type onNetTypedCB<T> = (data: T) => void;

// Simple generic wrapper around onNet for type safety
export const onNetTyped = <T = any>(eventName: string, cb: onNetTypedCB<T>) => onNet(eventName, cb);

// Simple generic wrapper around emitNet, except that we switch src and first arg if on server.
// source is defined using the third arg
export const emitNetTyped = <T = any>(eventName: string, data: T, src?: number) => {
  if (src) {
    return emitNet(eventName, src, data);
  }

  emitNet(eventName, data);
};

export const distanceBetweenCoords = (coords1: number[], coords2: number[]): number => {
  const [x1,y1] = coords1
  const [x2, y2] = coords2

  return Math.sqrt(
    Math.pow((x2-x1), 2) +
    Math.pow((y2-y1), 2)
  )
}
