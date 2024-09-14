/**
 * Converts all Date properties to string
 *
 * It should also handle optional Date properties. If the property is optional, it should be converted to string | undefined.
 */
export type StringifyDates<T> = {
  [K in keyof T]: T[K] extends Date | undefined ? string : T[K];
};
