import React from 'react';

import { safeWindow, safeWindowOperation } from '@eye8/shared/utils';

export const triggerDimensionsCorrect = () => safeWindowOperation((w) => w.dispatchEvent(new Event('resize')));

type Dimensions = { width: number; height: number };

interface IArgs<T> {
  ref: React.RefObject<T | null>;
  onChange?: (dimensions: Dimensions) => void;
}

const useElementDimensions = <T extends HTMLElement = HTMLElement>({ ref, onChange }: IArgs<T>) => {
  const [dimensions, setDimensions] = React.useState<Dimensions | undefined>(undefined);

  const correctDimensions = React.useCallback(() => {
    if (ref.current) {
      const newDimensions = ref.current.getBoundingClientRect();
      if (!dimensions || newDimensions.width !== dimensions.width || newDimensions.height !== dimensions.height) {
        setDimensions(newDimensions);
        onChange && onChange(newDimensions);
      }
    }
  }, [ref, dimensions, onChange]);

  React.useEffect(
    () =>
      safeWindow((w) => {
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

export default useElementDimensions;
