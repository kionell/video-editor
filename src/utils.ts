import { Ref } from 'react';

/**
 * @param obj Target object.
 * @returns Whether this object is iterable or not.
 */
export function isIterable(obj: any): boolean {
  if (obj === null || obj === undefined) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

/**
 * Converts object property to a ref.
 * @param target Target object.
 * @param name Object property.
 * @returns Converted ref.
 */
export function convertToRef(target: any, name: string): Ref<any> {
  return (e: any) => e && (target[name] = e);
}

export type BinarySearchPredicate<T> = (value: T, index: number, arr: T[]) => boolean;

/**
 * Searches for a value by predicate function. 
 * @param arr The list of any values.
 * @param predicate Predicate function.
 * @returns Found index or -1.
 */
 export function findIndex<T>(arr: T[], predicate: BinarySearchPredicate<T>): number {
  let l = -1;
  let r = arr.length - 1;

  while (1 + l < r) {
    const mid = l + ((r - l) >> 1);
    const cmp = predicate(arr[mid], mid, arr);

    cmp ? (r = mid) : (l = mid);
  }

  return r;
}
