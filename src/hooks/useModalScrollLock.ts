import * as React from 'react';

import { safeDocument } from 'src/utils/dom';

export const useModalScrollLock = (...conditions: boolean[]) => {
  React.useEffect(
    () =>
      safeDocument((d) => {
        if (conditions.some((c) => !c)) {
          return;
        }

        const prevOverflow = d.documentElement.style.overflow;
        const prevMaxHeight = d.documentElement.style.maxHeight;

        d.documentElement.style.overflow = 'hidden';
        d.documentElement.style.maxHeight = '100vh';

        return () => {
          d.documentElement.style.overflow = prevOverflow;
          d.documentElement.style.maxHeight = prevMaxHeight;
        };
      }, undefined),
    [conditions],
  );
};
