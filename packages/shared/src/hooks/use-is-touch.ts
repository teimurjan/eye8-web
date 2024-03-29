import React from 'react';

import { safeWindow, safeDocument } from '@eye8/shared/utils';

const useIsTouch = () => {
  const [isTouch, setIsTouch] = React.useState(safeDocument((d) => 'ontouchstart' in d.documentElement, false));

  React.useEffect(
    () =>
      safeWindow((w) => {
        const onTouchStart = () => {
          setIsTouch(true);
          w.removeEventListener('touchstart', onTouchStart, false);
        };
        w.addEventListener('touchstart', onTouchStart, { passive: true });

        return () => w.removeEventListener('touchstart', onTouchStart, false);
      }, undefined),
    [],
  );

  return isTouch;
};

export default useIsTouch;
