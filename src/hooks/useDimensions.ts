import * as React from 'react';

import { safeWindow } from 'src/utils/dom';

export const triggerDimensionsCorrect = () => safeWindow(w => w.dispatchEvent(new Event('resize')), undefined);

export const useDimensions = <T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  getElementDimensions: (el: T) => { width: number; height: number } = el => el.getBoundingClientRect(),
) => {
  const [dimensions, setDimensions] = React.useState<{ width: number; height: number } | undefined>(undefined);

  const correctDimensions = React.useCallback(() => {
    if (ref.current) {
      const { width, height } = getElementDimensions(ref.current);
      if (!dimensions || width !== dimensions.width || height !== dimensions.height) {
        setDimensions({ width, height });
      }
    }
  }, [ref, getElementDimensions, dimensions]);

  React.useLayoutEffect(() => {
    if (ref.current) {
      correctDimensions();

      safeWindow(w => w.addEventListener('resize', correctDimensions), undefined);

      return () => safeWindow(w => w.removeEventListener('resize', correctDimensions), undefined);
    }

    return undefined;
  }, [ref, correctDimensions, dimensions]);

  return dimensions;
};
