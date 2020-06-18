import * as React from 'react';

import { safeDocument } from 'src/utils/dom';

export const useModalScrollLock = (...conditions: boolean[]) => {
  React.useEffect(
    () =>
      safeDocument(
        d => {
          if (conditions.some(c => !c)) {
            return;
          }

          const prevOverflow = d.body.style.overflow;
          const prevMaxHeight = d.body.style.maxHeight;

          d.body.style.overflow = 'hidden';
          d.body.style.maxHeight = '100vh';

          return () => {
            d.body.style.overflow = prevOverflow;
            d.body.style.maxHeight = prevMaxHeight;
          };
        },
        () => {},
      ),
    [conditions],
  );
};
