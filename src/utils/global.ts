import { safeWindow, isWindowDefined } from 'src/utils/dom';

export const getGlobal = (key: string) => {
  return safeWindow(w => w[key], global[key]);
};

export const setGlobal = <T>(key: string, value: T) => {
  if (isWindowDefined()) {
    window[key] = value;
  } else {
    global[key] = value;
  }
};
