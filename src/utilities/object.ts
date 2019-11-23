import _has from 'lodash.has';
import _get from 'lodash.get';

export const has = (path: string | string[]) => (object: any): boolean => {
  return _has(object, path);
};

export const get = (path: string | string[]) => (object: any): any => {
  return _get(object, path);
};
