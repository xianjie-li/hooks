export type AnyObject = {
  [key: string]: any;
};

export type AnyFn = (...arg: any[]) => any;

export const placeHolderFn = () => undefined;

export function getGlobal() {
  return typeof window !== 'undefined' ? window : global;
}
