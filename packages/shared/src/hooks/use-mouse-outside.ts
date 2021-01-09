import { useEffect } from 'react';

import { safeDocument } from '@eye8/shared/utils';

export const isEventInBounds = (e: MouseEvent, ref: React.RefObject<HTMLElement>, offset: number) => {
  const { clientX, clientY } = e;
  if (ref.current && clientX && clientY) {
    const { bottom, top, left, right } = ref.current.getBoundingClientRect();
    return top - offset < clientY && bottom + offset > clientY && left - offset < clientX && right + offset > clientX;
  } else {
    return false;
  }
};

interface Options {
  attachHandler: boolean;
  offset?: number;
}

const DEFAULT_OPTIONS = { attachHandler: true, offset: 30 };

const useMouseOutside = (
  refs: React.RefObject<HTMLElement> | Array<React.RefObject<HTMLElement>>,
  callback: () => void,
  options: Options = DEFAULT_OPTIONS,
) => {
  useEffect(
    () =>
      safeDocument((d) => {
        const handleMouseOut: EventListener = (e) => {
          if (Array.isArray(refs)) {
            if (refs.every((ref) => !isEventInBounds(e as MouseEvent, ref, options.offset ?? DEFAULT_OPTIONS.offset))) {
              callback();
            }
          } else {
            if (!isEventInBounds(e as MouseEvent, refs, options.offset ?? DEFAULT_OPTIONS.offset)) {
              callback();
            }
          }
        };

        if (options.attachHandler) {
          d.addEventListener('mousemove', handleMouseOut);
        } else {
          d.removeEventListener('mousemove', handleMouseOut);
        }
        return () => {
          d.removeEventListener('mousemove', handleMouseOut);
        };
      }, undefined),
    [options, callback, refs],
  );
};

export default useMouseOutside;
