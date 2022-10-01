export function isIterable(obj: any): boolean {
  if (obj === null || obj === undefined) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

export function convertToRef(target: any, name: string) {
  return (e: any) => e && (target[name] = e);
}
