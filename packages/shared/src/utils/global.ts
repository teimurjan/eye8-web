import { safeWindow, isWindowDefined } from '@eye8/shared/utils';

export const getGlobal = (key: string) => {
  return safeWindow((w) => w[key], global[key]);
};

export const setGlobal = <T>(key: string, value: T) => {
  if (isWindowDefined()) {
    window[key] = value;
  } else {
    global[key] = value;
  }
};
