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
