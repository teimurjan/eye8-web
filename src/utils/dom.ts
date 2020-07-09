import { SyntheticEvent } from 'react';

export const PAGE_LOADER_ID = 'pageLoader';

export const preventDefault = <T extends SyntheticEvent>(fn: (e: T) => void) => (e: T) => {
  e.preventDefault();
  fn(e);
};

export const isWindowDefined = () => typeof window !== 'undefined';
export const isDocumentDefined = () => typeof document !== 'undefined';

export function safeWindowOperation(f: (w: Window) => void) {
  if (isWindowDefined()) {
    f(window);
  }
}

export function safeWindow<T>(f: ((w: Window) => T) | T, defaultValue: T) {
  if (isWindowDefined()) {
    if (typeof f === 'function') {
      return (f as (w: Window) => T)(window);
    } else {
      return f as T;
    }
  }

  return defaultValue;
}

export function safeDocumentOperation(f: (d: Document) => void) {
  if (isDocumentDefined()) {
    f(document);
  }
}

export function safeDocument<T>(f: ((d: Document) => T) | T, defaultValue: T) {
  if (isWindowDefined()) {
    if (typeof f === 'function') {
      return (f as (d: Document) => T)(document);
    } else {
      return f as T;
    }
  }

  return defaultValue;
}