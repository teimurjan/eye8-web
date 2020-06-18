import { useEffect } from 'react';

import { safeDocument } from 'src/utils/dom';

export const isEventInBounds = (e: MouseEvent, ref: React.RefObject<HTMLElement>, offset = 0) => {
  const { clientX, clientY } = e;
  if (ref.current && clientX && clientY) {
    const { bottom, top, left, right } = ref.current.getBoundingClientRect();
    return top - offset < clientY && bottom + offset > clientY && left - offset < clientX && right + offset > clientX;
  } else {
    return false;
  }
};

export const useMouseOutside = (
  refs: React.RefObject<HTMLElement> | Array<React.RefObject<HTMLElement>>,
  callback: () => void,
  attachHandler = true,
) => {
  useEffect(
    () =>
      safeDocument(d => {
        const handleMouseOut: EventListener = e => {
          if (Array.isArray(refs)) {
            if (refs.every(ref => !isEventInBounds(e as MouseEvent, ref, 30))) {
              callback();
            }
          } else {
            if (!isEventInBounds(e as MouseEvent, refs, 30)) {
              callback();
            }
          }
        };

        if (attachHandler) {
          d.addEventListener('mousemove', handleMouseOut);
        } else {
          d.removeEventListener('mousemove', handleMouseOut);
        }
        return () => {
          d.removeEventListener('mousemove', handleMouseOut);
        };
      }, undefined),
    [attachHandler, callback, refs],
  );
};

export default useMouseOutside;
