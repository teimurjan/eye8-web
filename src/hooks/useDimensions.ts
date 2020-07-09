import * as React from 'react';

import { safeWindow, safeWindowOperation } from 'src/utils/dom';

export const triggerDimensionsCorrect = () => safeWindowOperation(w => w.dispatchEvent(new Event('resize')));

export const defaultGetElementDimensions = (el: HTMLElement) => el.getBoundingClientRect();

export const useDimensions = <T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null>,
  getElementDimensions: (el: T) => { width: number; height: number } = defaultGetElementDimensions,
  cb?: () => void,
) => {
  const [dimensions, setDimensions] = React.useState<{ width: number; height: number } | undefined>(undefined);

  const correctDimensions = React.useCallback(() => {
    if (ref.current) {
      const { width, height } = getElementDimensions(ref.current);
      if (!dimensions || width !== dimensions.width || height !== dimensions.height) {
        setDimensions({ width, height });
        cb && cb();
      }
    }
  }, [ref, getElementDimensions, dimensions, cb]);

  React.useEffect(
    () =>
      safeWindow(w => {
        if (ref.current) {
          correctDimensions();

          w.addEventListener('resize', correctDimensions);

          return () => w.removeEventListener('resize', correctDimensions);
        }

        return undefined;
      }, undefined),
    [ref, correctDimensions, dimensions],
  );

  return dimensions;
};
